import * as t from "io-ts";
import { Parser, Response, route } from "typera-express";
import { prisma } from "../util/prisma";

export module AuthController {
    export const createUser = route
        .post("/user")
        .use(
            Parser.body(
                t.type({
                    name: t.string,
                    email: t.string,
                    image: t.string,
                    emailVerified: t.null,
                })
            )
        )
        .handler(async ({ body }) => {
            const user = await prisma.user.create({ data: body });

            return Response.ok(user);
        });

    export const getUser = route.get("/user/:id").handler(async (request) => {
        const { id } = request.routeParams;
        const user = await prisma.user.findUnique({ where: { id } });

        return Response.ok(user);
    });

    export const getUserByEmail = route
        .get("/user-email/:email")
        .handler(async (request) => {
            const { email } = request.routeParams;
            const user = await prisma.user.findUnique({ where: { email } });

            return Response.ok(user);
        });

    export const getUserByAccount = route
        .get("/user-account/:provider/:providerAccountId")
        .handler(async (request) => {
            const { provider, providerAccountId } = request.routeParams;
            const account = await prisma.account.findUnique({
                where: {
                    provider_providerAccountId: { provider, providerAccountId },
                },
                select: { user: true },
            });

            return Response.ok(account?.user ?? { error: "failed" });
        });

    export const updateUser = route
        .patch("/user")
        .use(
            Parser.body(
                t.partial({
                    id: t.string,
                    name: t.string,
                    email: t.string,
                    image: t.string,
                    emailVerified: t.any,
                })
            )
        )
        .handler(async ({ body }) => {
            const user = await prisma.user.update({
                where: { id: body.id },
                data: body,
            });

            return Response.ok(user);
        });

    export const linkAccount = route
        .post("/linkAccount")
        .use(
            Parser.body(
                t.type({
                    provider: t.string,
                    type: t.string,
                    providerAccountId: t.string,
                    access_token: t.string,
                    expires_at: t.number,
                    scope: t.string,
                    token_type: t.string,
                    id_token: t.string,
                    userId: t.string,
                })
            )
        )
        .handler(async ({ body }) => {
            const account = await prisma.account.create({
                data: body,
            });

            return Response.ok(account);
        });

    export const createSession = route
        .post("/session")
        .use(
            Parser.body(
                t.type({
                    sessionToken: t.string,
                    userId: t.string,
                    expires: t.string,
                })
            )
        )
        .handler(async ({ body }) => {
            const session = await prisma.session.create({
                data: body,
            });

            return Response.ok(session);
        });

    export const getSessionAndUser = route
        .get("/session/:sessionToken")
        .handler(async ({ routeParams }) => {
            const { sessionToken } = routeParams;
            const userAndSession = await prisma.session.findUnique({
                where: { sessionToken },
                include: { user: true },
            });

            if (!userAndSession)
                return Response.ok({ error: "No session found" });

            const { user, ...session } = userAndSession;
            return Response.ok({ user, session });
        });

    export const updateSession = route
        .patch("/session")
        .use(
            Parser.body(
                t.partial({
                    sessionToken: t.string,
                    userId: t.string,
                    expires: t.string,
                })
            )
        )
        .handler(async ({ body }) => {
            const session = await prisma.session.update({
                where: { sessionToken: body.sessionToken },
                data: body,
            });

            return Response.ok(session);
        });

    export const deleteSession = route
        .delete("/session/:sessionToken")
        .handler(async ({ routeParams }) => {
            const { sessionToken } = routeParams;
            const deleted = await prisma.session.delete({
                where: { sessionToken },
            });

            return Response.ok(deleted);
        });
}
