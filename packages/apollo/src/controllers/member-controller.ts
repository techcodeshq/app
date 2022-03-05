import {
  AuditLogAction,
  AuditLogEntity,
  BranchMember,
  EventLinkRedeemStatus,
  Perm,
} from "@prisma/client";
import { route, Response, Parser } from "typera-express";
import { authenticated, authorized } from "../middlewares/authentication";
import { prisma } from "../util/prisma";
import { audit } from "../util/audit";
import * as t from "io-ts";

export module MemberController {
  export const getMember = route
    .get("/:userId/:branchId")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_MEMBER))
    .handler(async ({ routeParams }) => {
      const branchMember = await prisma.branchMember.findUnique({
        where: {
          userId_branchId: {
            userId: routeParams.userId,
            branchId: routeParams.branchId,
          },
        },
        include: {
          user: true,
          branch: true,
        },
      });

      return Response.ok(branchMember);
    });

  export const getMemberById = route
    .get("/:branchId")
    .use(authenticated(null))
    .handler(async ({ routeParams, user }) => {
      const member = await prisma.branchMember.findUnique({
        where: {
          userId_branchId: { userId: user.id, branchId: routeParams.branchId },
        },
        include: {
          user: true,
          branch: true,
        },
      });

      return Response.ok(member);
    });

  export const getMetadataUser = route
    .get("/:id/metadata-user")
    .use(authenticated(null))
    .handler(async ({ routeParams, user }) => {
      const branchMember = await prisma.branchMember.findUnique({
        where: {
          userId_branchId: { userId: user.id, branchId: routeParams.id },
        },
        select: { id: true },
      });

      const metadata = await queryMetadata(branchMember!.id);

      return Response.ok(metadata);
    });

  export const getMetadataById = route
    .get("/:id/metadata")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_MEMBER))
    .handler(async ({ routeParams }) => {
      const metadata = await queryMetadata(routeParams.id);

      return Response.ok(metadata);
    });

  export const editMetadata = route
    .patch("/metadata")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_MEMBER))
    .use(
      Parser.body(
        t.type({
          memberId: t.string,
          key: t.string,
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
}