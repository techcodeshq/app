import {
  AuditLogAction,
  AuditLogEntity,
  EventLink,
  EventLinkRedeemStatus,
  KeyValueAction,
  LinkApplyInstructions,
  BranchMember,
  Perm,
  Branch,
} from "@prisma/client";
import { randomBytes } from "crypto";
import * as t from "io-ts";
import { Parser, Response, route } from "typera-express";
import { authenticated, authorized } from "../middlewares/authentication";
import { audit } from "../util/audit";
import { prisma } from "../util/prisma";

export module LinksController {
  const NOT_UNIQUE_ERROR = "P2002";

  export const getLinkActions = route
    .get("/actions")
    .use(authenticated(null))
    .handler(async () => {
      const actions = await prisma.linkApplyInstructions.findMany({
        select: { key: true },
      });

      return Response.ok(actions);
    });

  export const getLinks = route
    .get("/:eventId")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_EVENT_LINK))
    .handler(async ({ routeParams }) => {
      const { eventId } = routeParams;

      const links = await prisma.eventLink.findMany({
        where: { eventId },
        include: {
          metadata: true,
          _count: {
            select: { redeemedBy: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return Response.ok(links);
    });

  export const getLink = route
    .get("/:id")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_EVENT_LINK))
    .handler(async ({ routeParams }) => {
      const { id } = routeParams;
      const link = await prisma.eventLink.findUnique({ where: { id } });

      return Response.ok(link);
    });

  export const getRedeemed = route
    .get("/redeemed/:id")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_EVENT_LINK))
    .handler(async ({ routeParams }) => {
      const { id } = routeParams;
      const redeemed = await prisma.eventLinkRedeem.findMany({
        where: { eventLinkId: id },
        orderBy: { createdAt: "desc" },
        include: {
          member: {
            select: {
              user: { select: { name: true, image: true } },
              id: true,
            },
          },
        },
      });

      return Response.ok(redeemed);
    });

  export const getLinkByCode = route
    .get("/code/:code")
    .use(authenticated(null))
    .handler(async ({ routeParams }) => {
      const { code } = routeParams;
      const link = await prisma.eventLink.findUnique({
        where: { code },
        include: { metadata: true },
      });

      return Response.ok(link);
    });

  export const createLink = route
    .post("/")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_LINK))
    .use(
      Parser.body(
        t.type({
          name: t.string,
          eventId: t.string,
          uses: t.union([t.null, t.number]),
          instructions: t.array(
            t.type({
              key: t.string,
              value: t.number,
              action: t.keyof(KeyValueAction),
            }),
          ),
        }),
      ),
    )
    .handler(async ({ body, user }) => {
      const { eventId, name, instructions, uses } = body;
      const code = randomBytes(3).toString("hex");

      try {
        const event = await prisma.event.update({
          where: { id: eventId },
          data: {
            links: {
              create: {
                name,
                code,
                uses,
                metadata: {
                  createMany: {
                    data: instructions.map((inst) => ({
                      ...inst,
                      key: inst.key.toLowerCase(),
                    })),
                  },
                },
              },
            },
          },
          include: {
            links: {
              where: {
                code,
              },
              include: {
                metadata: true,
              },
            },
          },
        });

        await audit({
          action: AuditLogAction.CREATE,
          entity: AuditLogEntity.EVENT_LINK,
          author: user,
          description: `Created Link: ${event.links[0].name} for event: ${event.name}`,
        });
        return Response.ok(event.links[0]);
      } catch (err: any) {
        if (err.code === NOT_UNIQUE_ERROR) {
          return Response.ok({
            error: "KEYS_NOT_UNIQUE",
            description: "Cannot have multiple actions with the same key!",
          });
        }

        return Response.ok({ error: "ERROR", description: err.code });
      }
    });

  export const toggleLink = route
    .patch("/")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_LINK))
    .use(Parser.body(t.type({ id: t.string, value: t.boolean })))
    .handler(async ({ body, user }) => {
      const { id, value } = body;
      const link = await prisma.eventLink.update({
        where: { id },
        data: {
          enabled: value,
        },
      });

      await audit({
        action: AuditLogAction.UPDATE,
        entity: AuditLogEntity.EVENT_LINK,
        author: user,
        description: `Toggled Link: ${link.name} to ${link.enabled}`,
      });
      return Response.ok(link);
    });

  export const redeemLink = route
    .post("/redeem")
    .use(authenticated(null))
    .use(
      Parser.body(
        t.type({
          code: t.string,
        }),
      ),
    )
    .handler(async ({ user, body }) => {
      const { code } = body;

      const link = await prisma.eventLink.findUnique({
        where: { code },
        include: {
          metadata: true,
          event: {
            include: {
              branch: {
                include: {
                  members: {
                    where: {
                      userId: user.id,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!link)
        return Response.ok({
          error: "LINK_NOT_FOUND",
          description: "No link found with this code",
        });

      if (link.event.branch.members.length === 0)
        return Response.ok({
          error: "USER_NOT_IN_BRANCH",
          description:
            "Cannot redeem link for an event in a branch that you are not in",
        });

      await audit({
        action: AuditLogAction.CREATE,
        entity: AuditLogEntity.EVENT_LINK_REDEEM,
        author: user,
        description: `${user.name} redeemed ${link.name}`,
      });
      return await _redeem(link, link.event.branch.members[0]);
    });

  export const grantLink = route
    .post("/grant")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_LINK))
    .use(Parser.body(t.type({ memberId: t.string, linkId: t.string })))
    .handler(async ({ body, user: philanthropist }) => {
      const { linkId, memberId } = body;

      const link = await prisma.eventLink.findUnique({
        where: { id: linkId },
        include: { metadata: true },
      });

      if (!link)
        return Response.ok({
          error: "LINK_NOT_FOUND",
          description: "No link found with this code",
        });

      const member = await prisma.branchMember.findUnique({
        where: { id: memberId },
        include: { user: true },
      });

      if (!member)
        return Response.ok({
          error: "USER_NOT_FOUND",
          description: "No user associated with this ID!",
        });

      await audit({
        author: philanthropist,
        action: AuditLogAction.CREATE,
        entity: AuditLogEntity.EVENT_LINK_REDEEM,
        description: `Granted ${link.name} to ${member.user.name}`,
      });
      return await _redeem(link, member);
    });

  export const deleteEventLink = route
    .delete("/:id")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_LINK))
    .handler(async ({ routeParams, user }) => {
      const link = await prisma.eventLink.findUnique({
        where: { id: routeParams.id },
        include: { redeemedBy: true },
      });

      if (link!.redeemedBy.length > 0) {
        return Response.ok({
          error: "LINK_NOT_UNUSED",
          description:
            "this link has been used, and thus should not be deleted",
        });
      }

      const deletedLink = await prisma.eventLink.delete({
        where: { id: routeParams.id },
      });

      await audit({
        author: user,
        action: AuditLogAction.DELETE,
        entity: AuditLogEntity.EVENT_LINK,
        description: `Deleted Link: ${deletedLink.name}`,
      });
      return Response.ok(link);
    });

  export const deleteEventLinkRedeem = route
    .delete("/redeem/:linkId/:memberId")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_LINK))
    .handler(async ({ routeParams, user }) => {
      const linkRedeem = await prisma.eventLinkRedeem.delete({
        where: {
          memberId_eventLinkId: {
            memberId: routeParams.memberId,
            eventLinkId: routeParams.linkId,
          },
        },
        include: {
          eventLink: true,
          member: { include: { user: true } },
        },
      });

      await audit({
        author: user,
        action: AuditLogAction.DELETE,
        entity: AuditLogEntity.EVENT_LINK_REDEEM,
        description: `Deleted ${linkRedeem.eventLink.name} for ${linkRedeem.member.user.name}`,
      });
      return Response.ok(linkRedeem);
    });

  const _redeem = async (
    link: EventLink & { metadata: LinkApplyInstructions[] },
    member: BranchMember,
  ) => {
    const validation = await validateLink(link, member.id);
    if (validation) return validation;

    try {
      await prisma.$transaction([
        ...link.metadata.map((md) =>
          prisma.userMetadata.upsert({
            where: {
              key_memberId: { key: md.key, memberId: member.id },
            },
            create: {
              key: md.key,
              value: md.value,
              memberId: member.id,
            },
            update: {
              key: md.key,
              value: { [md.action.toLowerCase()]: md.value },
              memberId: member.id,
            },
          }),
        ),
        prisma.eventLink.update({
          where: { id: link.id },
          data: {
            uses: {
              decrement: 1,
            },
          },
        }),
      ]);
    } catch (err) {
      return await generateLinkRedeem(
        EventLinkRedeemStatus.FAILED,
        err + "",
        link.id,
        member.id,
      );
    }

    return await generateLinkRedeem(
      EventLinkRedeemStatus.SUCCESS,
      "Things have worked well",
      link.id,
      member.id,
    );
  };

  const validateLink = async (link: EventLink, memberId: string) => {
    const existingRedeem = await prisma.eventLinkRedeem.findUnique({
      where: {
        memberId_eventLinkId: {
          memberId,
          eventLinkId: link.id,
        },
      },
    });

    if (existingRedeem) {
      return Response.ok({
        error: "LINK_REDEEMED",
        description: "User has already redemeed link",
      });
    }

    if (!link.enabled) {
      return await generateLinkRedeem(
        EventLinkRedeemStatus.FAILED,
        `This link has been disabled at ${link.updatedAt.toISOString()}`,
        link.id,
        memberId,
      );
    }

    if (link.uses !== null && link.uses <= 0) {
      return await generateLinkRedeem(
        EventLinkRedeemStatus.FAILED,
        "This link is out of uses!",
        link.id,
        memberId,
      );
    }

    return false;
  };

  const generateLinkRedeem = async (
    status: EventLinkRedeemStatus,
    statusDescription: string,
    eventLinkId: string,
    memberId: string,
  ) => {
    const redeem = await prisma.eventLinkRedeem.create({
      data: {
        status,
        statusDescription,
        eventLinkId,
        memberId,
      },
    });
    return Response.ok(redeem);
  };
}
