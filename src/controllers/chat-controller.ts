import { Role } from "@prisma/client";
import { Parser, Response, route } from "typera-express";
import { authenticated, authorized } from "../middlewares/authenticated";
import { prisma } from "../util/prisma";
import * as t from "io-ts";

export module ChatController {
    export const getMessages = route
        .get("/:taskId")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const messages = await prisma.chatMessage.findMany({
                where: { eventTaskId: routeParams.taskId },
                include: {
                    author: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return Response.ok(messages);
        });

    export const createMessage = route
        .post("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    taskId: t.string,
                    content: t.string,
                }),
            ),
        )
        .handler(async ({ user, body }) => {
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

            const message = await prisma.eventTask.update({
                where: {
                    id: task.id,
                },
                data: {
                    messages: {
                        create: {
                            content,
                            authorId: user.id,
                        },
                    },
                },
            });

            return Response.ok(message);
        });
}
