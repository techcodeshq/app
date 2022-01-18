import { prisma } from "../util/prisma";
import { route, Parser, Response } from "typera-express";
import * as t from "io-ts";
import { Role } from "@prisma/client";
import { authenticated, authorized } from "../middlewares/authenticated";

export module TaskController {
    export const getTask = route
        .get("/:taskId")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const task = await prisma.eventTask.findUnique({
                where: { id: routeParams.taskId },
                include: {
                    subTasks: {
                        orderBy: [{ dueDate: "asc" }, { name: "asc" }],
                        include: {
                            assignees: { include: { user: true } },
                            _count: {
                                select: {
                                    subTasks: true,
                                },
                            },
                        },
                    },
                    assignees: { include: { user: true } },
                },
            });

            return Response.ok({ ...task, isRoot: false });
        });

    export const createTask = route
        .post("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    name: t.string,
                    description: t.string,
                    baseId: t.string,
                    dueDate: t.string,
                }),
            ),
        )
        .handler(async ({ body }) => {
            const task = await prisma.eventTask.create({
                data: {
                    name: body.name,
                    description: body.description,
                    eventId: body.baseId,
                    dueDate: body.dueDate,
                },
            });

            if (!task) {
                return Response.ok({
                    error: "INVALID_EVENT",
                    description: "Event with that id does not exist",
                });
            }

            return Response.ok(task);
        });

    export const createSubTask = route
        .post("/sub-task")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    baseId: t.string,
                    name: t.string,
                    description: t.string,
                    dueDate: t.string,
                }),
            ),
        )
        .handler(async ({ body }) => {
            const parentTask = await prisma.eventTask.findUnique({
                where: { id: body.baseId },
                include: { assignees: true, subTasks: true },
            });

            if (!parentTask) {
                return Response.ok({
                    error: "INVALID_PARENT_TASK",
                    description: "Parent task with that id does not exist",
                });
            }

            const task = await prisma.eventTask.update({
                where: {
                    id: body.baseId,
                },
                data: {
                    subTasks: {
                        create: {
                            name: body.name,
                            description: body.description,
                            eventId: parentTask.eventId,
                            dueDate: body.dueDate,
                        },
                    },
                },
                include: {
                    subTasks: { orderBy: { createdAt: "desc" } },
                },
            });

            // only works because subTasks is ordered by createdAt: "desc", meaning index 0 will be the new one
            const createdTask = task.subTasks[0];

            for (const assignee of parentTask.assignees) {
                await prisma.eventTaskOnUser.create({
                    data: {
                        userId: assignee.userId,
                        eventTaskId: createdTask.id,
                    },
                });
            }

            return Response.ok(task);
        });

    export const toggleAssignUser = route
        .patch("/assign")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    taskId: t.string,
                    userId: t.string,
                    assign: t.boolean,
                }),
            ),
        )
        .handler(async ({ body }) => {
            const task = body.assign
                ? await assign(body.taskId, body.userId)
                : await unassign(body.taskId, body.userId);
            delete (task as any).subTasks;

            return Response.ok(task);
        });

    const assign = async (taskId: string, userId: string) => {
        await prisma.eventTaskOnUser.create({
            data: { userId: userId, eventTaskId: taskId },
        });

        const task = await prisma.eventTask.findUnique({
            where: { id: taskId },
            include: {
                assignees: { include: { user: true } },
                subTasks: true,
            },
        });

        for (const subTask of task!.subTasks) {
            await assign(subTask.id, userId);
        }

        return task;
    };

    const unassign = async (taskId: string, userId: string) => {
        await prisma.eventTaskOnUser.delete({
            where: {
                userId_eventTaskId: {
                    eventTaskId: taskId,
                    userId: userId,
                },
            },
        });

        const task = await prisma.eventTask.findUnique({
            where: { id: taskId },
            include: {
                assignees: { include: { user: true } },
                subTasks: true,
            },
        });

        for (const subTask of task!.subTasks) {
            await unassign(subTask.id, userId);
        }

        return task;
    };

    export const getAssignees = route
        .get("/assignees/:taskId")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const assignees = await prisma.user.findMany({
                where: {
                    assignedTasks: {
                        some: { eventTaskId: routeParams.taskId },
                    },
                },
            });

            return Response.ok(assignees);
        });

    export const deleteTask = route
        .delete("/:taskId")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const res = await prisma.eventTask.delete({
                where: { id: routeParams.taskId },
                include: { subTasks: true, assignees: true },
            });

            return Response.ok(res);
        });

    export const toggleTask = route
        .patch("/toggle")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    taskId: t.string,
                    value: t.boolean,
                }),
            ),
        )
        .handler(async ({ body }) => {
            if (body.value) {
                const task = await completeTask(body.taskId);
                delete (task as any).subTasks;

                await completeParent(task.eventTaskId);

                return Response.ok(task);
            } else {
                const task = await prisma.eventTask.update({
                    where: { id: body.taskId },
                    data: {
                        completedAt: null,
                    },
                });

                if (!task) {
                    return Response.ok({
                        error: "INVALID_TASK_ID",
                        description:
                            "the provided task ID does not match a valid task",
                    });
                }

                await uncompleteParent(task.eventTaskId);

                return Response.ok(task);
            }
        });

    const completeTask = async (taskId: string) => {
        const task = await prisma.eventTask.update({
            where: { id: taskId },
            include: { subTasks: true },
            data: {
                completedAt: new Date(),
            },
        });

        for (const subTask of task?.subTasks) {
            await completeTask(subTask.id);
        }

        return task;
    };

    const completeParent = async (parentId: string | null) => {
        if (parentId) {
            const parentTask = await prisma.eventTask.findUnique({
                where: { id: parentId },
                include: { subTasks: true },
            });

            if (parentTask!.subTasks.every((task) => !!task.completedAt)) {
                await prisma.eventTask.update({
                    where: { id: parentTask!.id },
                    data: {
                        completedAt: new Date(),
                    },
                });

                await completeParent(parentTask!.eventTaskId);
            }
        }
    };

    const uncompleteParent = async (parentId: string | null) => {
        if (parentId) {
            const parentTask = await prisma.eventTask.findUnique({
                where: { id: parentId },
                include: { subTasks: true },
            });

            if (parentTask!.subTasks.some((task) => !task.completedAt)) {
                await prisma.eventTask.update({
                    where: { id: parentTask!.id },
                    data: {
                        completedAt: null,
                    },
                });

                await uncompleteParent(parentTask!.eventTaskId);
            }
        }
    };

    export const updateTask = route
        .patch("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    id: t.string,
                    data: t.partial({
                        name: t.string,
                        description: t.string,
                        dueDate: t.string,
                    }),
                }),
            ),
        )
        .handler(async ({ body }) => {
            const task = await prisma.eventTask.update({
                where: { id: body.id },
                data: body.data,
            });

            return Response.ok(task);
        });
}
