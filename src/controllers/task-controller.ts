import { prisma } from "../util/prisma";
import { route, Parser, Response } from "typera-express";
import * as t from "io-ts";

export module TaskController {
    export const getTask = route.get("/").handler(async ({ routeParams }) => {
        const tasks = await prisma.eventTask.findMany({
            where: { eventTaskId: null },
            include: { subTasks: true },
        });

        return Response.ok(tasks);
    });

    export const createTask = route
        .post("/")
        .use(
            Parser.body(
                t.type({
                    name: t.string,
                    description: t.string,
                }),
            ),
        )
        .handler(async ({ body }) => {
            const task = await prisma.eventTask.create({
                data: body,
            });

            return Response.ok(task);
        });

    export const createSubTask = route
        .post("/sub-task")
        .use(
            Parser.body(
                t.type({
                    taskId: t.string,
                    name: t.string,
                    description: t.string,
                }),
            ),
        )
        .handler(async ({ body }) => {
            const task = await prisma.eventTask.update({
                where: {
                    id: body.taskId,
                },
                data: {
                    subTasks: {
                        create: {
                            name: body.name,
                            description: body.description,
                        },
                    },
                },
                include: {
                    subTasks: true,
                },
            });

            return Response.ok(task);
        });
}
