import { prisma } from "../util/prisma";
import * as t from "io-ts";
import { route, Response, Parser } from "typera-express";
import { authenticated } from "../middlewares/authenticated";
import { generateSlug } from "../util/generate-slug";

export module BranchController {
  export const getBranches = route
    .get("/")
    .use(authenticated(null))
    .handler(async () => {
      const branch = await prisma.branch.findMany();

      return Response.ok(branch);
    });

  export const getBranch = route
    .get("/:slug")
    .use(authenticated(null))
    .handler(async ({ routeParams }) => {
      const branch = await prisma.branch.findUnique({
        where: { slug: routeParams.slug },
      });

      return Response.ok(branch);
    });

  export const createBranch = route
    .post("/")
    .use(authenticated(null))
    .use(
      Parser.body(
        t.type({
          name: t.string,
        }),
      ),
    )
    .handler(async ({ body }) => {
      const slug = await generateSlug("branch", body.name);
      const branch = await prisma.branch.create({ data: { ...body, slug } });

      return Response.ok(branch);
    });

  export const editBranch = route
    .patch("/")
    .use(authenticated(null))
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
    .use(authenticated(null))
    .handler(async ({ routeParams }) => {
      const branch = await prisma.branch.delete({
        where: { id: routeParams.id },
      });

      return Response.ok(branch);
    });
}
