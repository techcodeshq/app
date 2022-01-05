import { EventLinkRedeemStatus, Role } from "@prisma/client";
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

    export const getMetadata = route
        .get("/metadata")
        .use(authenticated)
        .handler(async ({ user }) => {
            const metadata = await prisma.user.findUnique({
                where: { id: user.id },
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

            return Response.ok({
                metadata: metadata?.metadata,
                links: metadata?.linkRedeem,
            });
        });
}
