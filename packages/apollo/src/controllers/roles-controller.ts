import { Parser, route, Response } from "typera-express";
import { authenticated } from "../middlewares/authenticated";
import * as t from "io-ts";
import { prisma } from "../util/prisma";
import { Perm } from "@prisma/client";

export module RoleController {
  export const createRole = route
    .post("/")
    .use(authenticated(null))
    .use(
      Parser.body(
        t.type({
          branchId: t.string,
          name: t.string,
        }),
      ),
    )
    .handler(async ({ body }) => {
      const role = await prisma.role.create({
        data: {
          branchId: body.branchId,
          name: body.name,
        },
      });

      return Response.ok(role);
    });

  export const editRole = route
    .patch("/")
    .use(authenticated(null))
    .use(Parser.body(t.type({ roleId: t.string, name: t.string })))
    .handler(async ({ body }) => {
      const role = await prisma.role.update({
        where: { id: body.roleId },
        data: { name: body.name },
      });

      return Response.ok(role);
    });

  export const setPerms = route
    .patch("/perms")
    .use(authenticated(null))
    .use(Parser.body(t.type({ roleId: t.string, perms: t.array(t.string) })))
    .handler(async ({ body }) => {
      const role = await prisma.role.update({
        where: { id: body.roleId },
        data: {
          perms: body.perms.map((p) => p as Perm),
        },
      });

      return Response.ok(role);
    });

  export const getRole = route
    .get("/:id")
    .use(authenticated(null))
    .handler(async ({ routeParams }) => {
      const role = await prisma.role.findUnique({
        where: { id: routeParams.id },
      });

      return Response.ok(role);
    });

  export const setRoles = route
    .post("/grant")
    .use(authenticated(null))
    .use(Parser.body(t.type({ memberId: t.string, roles: t.array(t.string) })))
    .handler(async ({ body }) => {
      const user = await prisma.branchMember.update({
        where: { id: body.memberId },
        data: {
          roles: {
            connect: body.roles.map((r) => ({
              id: r,
            })),
          },
        },
        include: {
          roles: true,
        },
      });

      return Response.ok(user);
    });

  export const deleteRole = route
    .delete("/:id")
    .use(authenticated(null))
    .handler(async ({ routeParams }) => {
      const role = await prisma.role.delete({
        where: { id: routeParams.id },
      });

      return Response.ok(role);
    });
}
