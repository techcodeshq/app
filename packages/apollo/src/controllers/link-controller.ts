import {
    EventLink,
    EventLinkRedeemStatus,
    KeyValueAction,
    LinkApplyInstructions,
    Role,
    User,
} from "@prisma/client";
import { randomBytes } from "crypto";
import * as t from "io-ts";
import { Parser, Response, route } from "typera-express";
import { authenticated, authorized } from "../middlewares/authenticated";
import { prisma } from "../util/prisma";

export module LinksController {
    const NOT_UNIQUE_ERROR = "P2002";

    export const getLinkActions = route
        .get("/actions")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async () => {
            const actions = (
                await prisma.linkApplyInstructions.findMany({
                    select: { key: true, public: true },
                })
            ).filter(
                (value, index, array) =>
                    !array.filter(
                        (v, i) =>
                            value.key === v.key &&
                            value.public === v.public &&
                            i < index,
                    ).length,
            );
            return Response.ok(actions);
        });

    export const getLinks = route
        .get("/:eventId")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const { eventId } = routeParams;
            const links = await prisma.eventLink.findMany({
                where: { eventId },
                include: { metadata: true },
                orderBy: { createdAt: "desc" },
            });

            return Response.ok(links);
        });

    export const getLink = route
        .get("/:id")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const { id } = routeParams;
            const link = await prisma.eventLink.findUnique({ where: { id } });

            return Response.ok(link);
        });

    export const getRedeemed = route
        .get("/redeemed/:id")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const { id } = routeParams;
            const redeemed = await prisma.eventLinkRedeem.findMany({
                where: { eventLinkId: id },
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                            id: true,
                        },
                    },
                },
            });

            return Response.ok(redeemed);
        });

    export const getLinkByCode = route
        .get("/code/:code")
        .use(authenticated)
        .handler(async ({ routeParams }) => {
            const { code } = routeParams;
            const link = await prisma.eventLink.findUnique({
                where: { code },
                include: { metadata: true },
            });

            return Response.ok(link);
        });

    export const createLink = route
        .post("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    name: t.string,
                    eventId: t.string,
                    uses: t.union([t.null, t.number]),
                    instructions: t.array(
                        t.type({
                            key: t.string,
                            value: t.number,
                            public: t.boolean,
                            action: t.keyof(KeyValueAction),
                        }),
                    ),
                }),
            ),
        )
        .handler(async ({ body }) => {
            const { eventId, name, instructions, uses } = body;
            const code = randomBytes(3).toString("hex");

            try {
                const event = await prisma.event.update({
                    where: { id: eventId },
                    data: {
                        links: {
                            create: {
                                name,
                                code,
                                uses,
                                metadata: {
                                    createMany: {
                                        data: instructions.map((inst) => ({
                                            ...inst,
                                            key: inst.key.toLowerCase(),
                                        })),
                                    },
                                },
                            },
                        },
                    },
                    include: {
                        links: {
                            where: {
                                code,
                            },
                            include: {
                                metadata: true,
                            },
                        },
                    },
                });

                return Response.ok(event.links[0]);
            } catch (err: any) {
                if (err.code === NOT_UNIQUE_ERROR) {
                    return Response.ok({
                        error: "KEYS_NOT_UNIQUE",
                        description:
                            "Cannot have multiple actions with the same key!",
                    });
                }

                return Response.ok({ error: "ERROR", description: err.code });
            }
        });

    export const toggleLink = route
        .patch("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(Parser.body(t.type({ id: t.string, value: t.boolean })))
        .handler(async ({ body }) => {
            const { id, value } = body;
            const link = await prisma.eventLink.update({
                where: { id },
                data: {
                    enabled: value,
                },
            });

            return Response.ok(link);
        });

    export const redeemLink = route
        .post("/redeem")
        .use(authenticated)
        .use(
            Parser.body(
                t.type({
                    code: t.string,
                }),
            ),
        )
        .handler(async ({ user, body }) => {
            const { code } = body;

            const link = await prisma.eventLink.findUnique({
                where: { code },
                include: { metadata: true },
            });

            if (!link)
                return Response.ok({
                    error: "LINK_NOT_FOUND",
                    description: "No link found with this code",
                });

            return await _redeem(link, user);
        });

    export const grantLink = route
        .post("/grant")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(Parser.body(t.type({ userId: t.string, linkId: t.string })))
        .handler(async ({ body }) => {
            const { linkId, userId } = body;

            const link = await prisma.eventLink.findUnique({
                where: { id: linkId },
                include: { metadata: true },
            });

            if (!link)
                return Response.ok({
                    error: "LINK_NOT_FOUND",
                    description: "No link found with this code",
                });

            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user)
                return Response.ok({
                    error: "USER_NOT_FOUND",
                    description: "No user associated with this ID!",
                });

            return await _redeem(link, user);
        });

    export const deleteEventLink = route
        .delete("/:id")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const link = await prisma.eventLink.findUnique({
                where: { id: routeParams.id },
                include: { redeemedBy: true },
            });

            if (link!.redeemedBy.length > 0) {
                return Response.ok({
                    error: "LINK_NOT_UNUSED",
                    description:
                        "this link has been used, and thus should not be deleted",
                });
            }

            await prisma.eventLink.delete({
                where: { id: routeParams.id },
            });

            return Response.ok(link);
        });

    export const deleteEventLinkRedeem = route
        .delete("/redeem/:linkId/:userId")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const linkRedeem = await prisma.eventLinkRedeem.delete({
                where: {
                    userId_eventLinkId: {
                        userId: routeParams.userId,
                        eventLinkId: routeParams.linkId,
                    },
                },
            });

            return Response.ok(linkRedeem);
        });

    const _redeem = async (
        link: EventLink & { metadata: LinkApplyInstructions[] },
        user: User,
    ) => {
        const validation = await validateLink(link, user.id);
        if (validation) return validation;

        try {
            await prisma.$transaction([
                ...link.metadata.map((md) =>
                    prisma.userMetadata.upsert({
                        where: {
                            key_userId: { key: md.key, userId: user.id },
                        },
                        create: {
                            key: md.key,
                            value: md.value,
                            userId: user.id,
                            public: md.public,
                        },
                        update: {
                            key: md.key,
                            value: { [md.action.toLowerCase()]: md.value },
                            userId: user.id,
                        },
                    }),
                ),
                prisma.eventLink.update({
                    where: { id: link.id },
                    data: {
                        uses: {
                            decrement: 1,
                        },
                    },
                }),
            ]);
        } catch (err) {
            return await generateLinkRedeem(
                EventLinkRedeemStatus.FAILED,
                err + "",
                link.id,
                user.id,
            );
        }

        return await generateLinkRedeem(
            EventLinkRedeemStatus.SUCCESS,
            "Things have worked well",
            link.id,
            user.id,
        );
    };

    const validateLink = async (link: EventLink, userId: string) => {
        const existingRedeem = await prisma.eventLinkRedeem.findUnique({
            where: {
                userId_eventLinkId: {
                    userId: userId,
                    eventLinkId: link.id,
                },
            },
        });

        if (existingRedeem) {
            return Response.ok({
                error: "LINK_REDEEMED",
                description: "User has already redemeed link",
            });
        }

        if (!link.enabled) {
            return await generateLinkRedeem(
                EventLinkRedeemStatus.FAILED,
                `This link has been disabled at ${link.updatedAt.toISOString()}`,
                link.id,
                userId,
            );
        }

        if (link.uses !== null && link.uses <= 0) {
            return await generateLinkRedeem(
                EventLinkRedeemStatus.FAILED,
                "This link is out of uses!",
                link.id,
                userId,
            );
        }

        return false;
    };

    const generateLinkRedeem = async (
        status: EventLinkRedeemStatus,
        statusDescription: string,
        eventLinkId: string,
        userId: string,
    ) => {
        const redeem = await prisma.eventLinkRedeem.create({
            data: {
                status,
                statusDescription,
                eventLinkId,
                userId,
            },
        });
        return Response.ok(redeem);
    };
}
