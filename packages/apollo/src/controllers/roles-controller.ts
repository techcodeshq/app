import { Parser, route, Response } from "typera-express";
import {
  authenticated,
  authorized,
  incredible,
} from "../middlewares/authentication";
import * as t from "io-ts";
import { prisma } from "../util/prisma";
import { Perm } from "@prisma/client";

export module RoleController {
  export const getAllRoles = route
    .get("/")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_ROLES))
    .handler(async () => {
      const roles = await prisma.role.findMany();
      return Response.ok(roles);
    });

  export const createRole = route
    .post("/")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_ROLES))
    .use(
      Parser.body(
        t.type({
          name: t.string,
        }),
      ),
    )
    .handler(async ({ body }) => {
      const role = await prisma.role.create({
        data: {
          name: body.name,
        },
      });

      return Response.ok(role);
    });

  export const editRole = route
    .patch("/")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_ROLES))
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
    .use(authorized(Perm.MANAGE_ROLES))
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
    .use(authorized(Perm.MANAGE_ROLES))
    .use(Parser.body(t.type({ userId: t.string, roles: t.array(t.string) })))
    .handler(async ({ body }) => {
      const user = prisma.user.update({
        where: { id: body.userId },
        data: {
          roles: {
            createMany: {
              data: body.roles.map((v) => ({
                name: v,
              })),
            },
          },
        },
      });

      return Response.ok(user);
    });

  export const deleteRole = route
    .delete("/:id")
    .use(authenticated(null))
    .use(incredible)
    .handler(async ({ routeParams }) => {
      const role = await prisma.role.delete({
        where: { id: routeParams.id },
      });

      return Response.ok(role);
    });
}
