import { prisma } from "../util/prisma";
import * as t from "io-ts";
import { route, Response, Parser } from "typera-express";
import { authenticated } from "../middlewares/authenticated";

export module BranchController {
  export const getBranch = route
    .get("/:id")
    .use(authenticated)
    .handler(async ({ routeParams }) => {
      const branch = await prisma.branch.findUnique({
        where: { id: routeParams.id },
      });

      return Response.ok(branch);
    });

  export const createBranch = route
    .post("/")
    .use(authenticated)
    .use(
      Parser.body(
        t.type({
          name: t.string,
        }),
      ),
    )
    .handler(async ({ body }) => {
      const branch = await prisma.branch.create({ data: body });

      return Response.ok(branch);
    });

  export const editBranch = route
    .patch("/")
    .use(authenticated)
    .use(
      Parser.body(
        t.type({ id: t.string, data: t.partial({ name: t.string }) }),
      ),
    )
    .handler(async ({ body }) => {
      const branch = await prisma.branch.update({
        where: { id: body.id },
        data: body.data,
      });

      return Response.ok(branch);
    });

  export const deleteBranch = route
    .delete("/:id")
    .use(authenticated)
    .handler(async ({ routeParams }) => {
      const branch = await prisma.branch.delete({
        where: { id: routeParams.id },
      });

      return Response.ok(branch);
    });
}
