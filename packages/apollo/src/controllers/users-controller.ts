import {
  AuditLogAction,
  AuditLogEntity,
  EventLinkRedeemStatus,
  Perm,
} from "@prisma/client";
import { route, Response, Parser } from "typera-express";
import { authenticated, authorized } from "../middlewares/authentication";
import { prisma } from "../util/prisma";
import * as t from "io-ts";
import { audit } from "../util/audit";

export module UserController {
  export const getUsers = route
    .get("/")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_USER))
    .handler(async () => {
      const users = await prisma.user.findMany();

      return Response.ok(users);
    });

  export const getUser = route
    .get("/:id")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_USER))
    .handler(async ({ routeParams }) => {
      const user = await prisma.user.findUnique({
        where: { id: routeParams.id },
      });

      return Response.ok(user);
    });

  export const getMetadata = route
    .get("/metadata")
    .use(authenticated(null))
    .handler(async ({ user }) => {
      const metadata = await queryMetadata(user.id);

      return Response.ok({
        metadata: metadata?.metadata,
        links: metadata?.linkRedeem,
      });
    });

  export const getMetadataById = route
    .get("/metadata/:id")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_USER))
    .handler(async ({ routeParams }) => {
      const metadata = await queryMetadata(routeParams.id);

      return Response.ok({
        metadata: metadata?.metadata,
        links: metadata?.linkRedeem,
      });
    });

  export const editMetadata = route
    .patch("/metadata")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_USER))
    .use(
      Parser.body(
        t.type({
          key: t.string,
          memberId: t.string,
          value: t.number,
        }),
      ),
    )
    .handler(async ({ body, user }) => {
      const metadata = await prisma.userMetadata.update({
        where: { key_memberId: { key: body.key, memberId: body.memberId } },
        data: {
          value: body.value,
        },
      });

      const updatingUser = await prisma.user.findUnique({
        where: { id: body.memberId },
      });

      await audit({
        author: user,
        action: AuditLogAction.UPDATE,
        entity: AuditLogEntity.USER_METADATA,
        description: `Updated ${updatingUser!.name}'s ${body.key} to ${
          body.value
        }`,
      });
      return Response.ok(metadata);
    });

  export const getTasks = route
    .get("/tasks")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_EVENT_TASK))
    .handler(async ({ user }) => {
      const tasks = await prisma.eventTask.findMany({
        where: { assignees: { some: { userId: user.id } } },
        include: {
          Event: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: [{ dueDate: "asc" }, { name: "asc" }],
      });

      return Response.ok(tasks);
    });

  const queryMetadata = async (memberId: string) => {
    const metadata = await prisma.branchMember.findUnique({
      where: { id: memberId },
      select: {
        metadata: {
          orderBy: {
            value: "desc",
          },
        },
        linkRedeem: {
          where: { status: EventLinkRedeemStatus.SUCCESS },
          select: {
            eventLink: {
              select: {
                metadata: {
                  select: {
                    eventLink: {
                      select: { name: true },
                    },
                    action: true,
                    key: true,
                    value: true,
                  },
                },
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return metadata;
  };

  export const deleteUser = route
    .delete("/:id")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_USER))
    .handler(async ({ routeParams, user: terminator }) => {
      const user = await prisma.user.delete({
        where: { id: routeParams.id },
      });

      await audit({
        author: terminator,
        action: AuditLogAction.DELETE,
        entity: AuditLogEntity.USER,
        description: `${user.name} was terminated!`,
      });
      return Response.ok(user);
    });
}
