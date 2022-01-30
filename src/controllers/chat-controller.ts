import { ChatMessage, Role } from "@prisma/client";
import * as t from "io-ts";
import { Parser, Response, route } from "typera-express";
import { Events } from "../gateway/chat/events";
import { authenticated, authorized } from "../middlewares/authenticated";
import { gateway } from "../middlewares/gateway";
import { prisma } from "../util/prisma";

export module ChatController {
    export const getMessages = route
        .get("/:taskId")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.query(
                t.type({
                    page: t.string,
                }),
            ),
        )
        .handler(async ({ routeParams, query }) => {
            const { page } = query;
            const messages = await prisma.chatMessage.findMany({
                where: { eventTaskId: routeParams.taskId },
                include: {
                    author: {
                        select: {
                            image: true,
                            name: true,
                            id: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip: parseInt(page) * 25,
                take: 25,
            });

            const grouped = _group(messages, parseInt(page));

            const total = await prisma.chatMessage.count({
                where: { eventTaskId: routeParams.taskId },
            });
            const hasMore = total - parseInt(page) * 25 > 0;

            return Response.ok({
                groups: grouped.reverse(),
                hasMore,
            });
        });

    export const createMessage = route
        .post("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(gateway)
        .use(
            Parser.body(
                t.type({
                    taskId: t.string,
                    content: t.string,
                }),
            ),
        )
        .handler(async ({ user, body, gateways }) => {
            const { content, taskId } = body;

            const task = await prisma.eventTask.findUnique({
                where: { id: taskId },
            });

            if (!task) {
                return Response.ok({
                    error: "INVALID_TASK_ID",
                    description:
                        "The provided task ID does not match a valid task",
                });
            }

            const message = await prisma.chatMessage.create({
                data: {
                    content,
                    authorId: user.id,
                    eventTaskId: task.id,
                },
                include: {
                    author: true,
                },
            });

            gateways.chat.to(taskId).emit(Events.MESSAGE_PUBLISHED, message);
            return Response.ok(message);
        });

    export const deleteMessage = route
        .delete("/:messageId")
        .use(Parser.query(t.type({ page: t.string })))
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(gateway)
        .handler(async ({ query, routeParams, gateways }) => {
            const { messageId } = routeParams;
            const { page } = query;
            const message = await prisma.chatMessage.delete({
                where: { id: messageId },
            });

            gateways.chat
                .to(message.eventTaskId)
                .emit(Events.MESSAGE_DELETED, parseInt(page));
            return Response.ok(message);
        });

    const _group = (
        messages: (ChatMessage & {
            author: {
                image: string | null;
                name: string | null;
                id: string;
            };
        })[],
        page: number,
    ) => {
        let currentUser;
        let currentDate;
        const grouped = [];

        for (const message of messages) {
            if (
                message.authorId !== currentUser ||
                new Date(message.createdAt).getMinutes() !==
                    new Date(currentDate as any).getMinutes()
            ) {
                grouped.push({
                    user: message.author,
                    createdAt: message.createdAt,
                    messages: [{ ...message, page }],
                });
                currentUser = message.authorId;
                currentDate = message.createdAt;

                continue;
            }

            delete (message as any).author;
            grouped[grouped.length - 1].messages.push({ ...message, page });
        }

        return grouped;
    };
}
