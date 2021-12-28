import { Role } from "@prisma/client";
import { route, Response } from "typera-express";
import { authenticated, authorized } from "../middlewares/authenticated";
import { prisma } from "../util/prisma";

export module UserController {
    export const getUsers = route
        .get("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async (request) => {
            const users = await prisma.user.findMany();

            return Response.ok(users);
        });
}
