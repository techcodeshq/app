import { EventLinkRedeemStatus, Role } from "@prisma/client";
import { route, Response, Parser } from "typera-express";
import { authenticated, authorized } from "../middlewares/authenticated";
import { prisma } from "../util/prisma";
import * as t from "io-ts";

export module UserController {
    export const getUsers = route
        .get("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async () => {
            const users = await prisma.user.findMany();

            return Response.ok(users);
        });

    export const getUser = route
        .get("/:id")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const user = await prisma.user.findUnique({
                where: { id: routeParams.id },
            });

            return Response.ok(user);
        });

    export const getMetadata = route
        .get("/metadata")
        .use(authenticated)
        .handler(async ({ user }) => {
            const metadata = await queryMetadata(user.id);

            return Response.ok({
                metadata: metadata?.metadata,
                links: metadata?.linkRedeem,
            });
        });

    export const getMetadataExec = route
        .get("/metadata/:id")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const metadata = await queryMetadata(routeParams.id);

            return Response.ok({
                metadata: metadata?.metadata,
                links: metadata?.linkRedeem,
            });
        });

    export const editMetadata = route
        .patch("/metadata")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    key: t.string,
                    userId: t.string,
                    value: t.number,
                }),
            ),
        )
        .handler(async ({ body }) => {
            const metadata = await prisma.userMetadata.update({
                where: { key_userId: { key: body.key, userId: body.userId } },
                data: {
                    value: body.value,
                },
            });

            return Response.ok(metadata);
        });

    export const getTasks = route
        .get("/tasks")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
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
            });

            return Response.ok(tasks);
        });

    const queryMetadata = async (userId: string) => {
        const metadata = await prisma.user.findUnique({
            where: { id: userId },
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
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const user = await prisma.user.delete({
                where: { id: routeParams.id },
            });

            return Response.ok(user);
        });
}
