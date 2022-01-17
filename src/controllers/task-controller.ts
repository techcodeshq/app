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
                        orderBy: {
                            createdAt: "asc",
                        },
                        include: {
                            assignees: { include: { user: true } },
                        },
                    },
                },
            });

            return Response.ok(task?.subTasks);
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
                    dueDate: new Date(body.dueDate),
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
                            dueDate: new Date(body.dueDate),
                        },
                    },
                },
                include: {
                    subTasks: true,
                },
            });

            const createdTask = task.subTasks.find(
                (newTask) => !parentTask.subTasks.find((t) => t == newTask),
            )!;

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

    export const assignUser = route
        .patch("/assign")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    taskId: t.string,
                    userId: t.string,
                }),
            ),
        )
        .handler(async ({ body }) => {
            const assign = async (taskId: string) => {
                await prisma.eventTaskOnUser.create({
                    data: { userId: body.userId, eventTaskId: taskId },
                });

                const task = await prisma.eventTask.findUnique({
                    where: { id: taskId },
                    include: {
                        assignees: { include: { user: true } },
                        subTasks: true,
                    },
                });

                for (const subTask of task!.subTasks) {
                    await assign(subTask.id);
                }

                return task;
            };

            const task = await assign(body.taskId);
            delete (task as any).subTasks;

            return Response.ok(task);
        });

    export const unassignUser = route
        .patch("/unassign")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    taskId: t.string,
                    userId: t.string,
                }),
            ),
        )
        .handler(async ({ body }) => {
            const unassign = async (taskId: string) => {
                await prisma.eventTaskOnUser.delete({
                    where: {
                        userId_eventTaskId: {
                            eventTaskId: taskId,
                            userId: body.userId,
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
                    await unassign(subTask.id);
                }

                return task;
            };

            const task = await unassign(body.taskId);
            delete (task as any).subTasks;

            return Response.ok(task);
        });

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

                const task = await completeTask(body.taskId);
                delete (task as any).subTasks;

                if (task.eventTaskId) {
                    const parentTask = await prisma.eventTask.findUnique({
                        where: { id: task.eventTaskId },
                        include: { subTasks: true },
                    });

                    if (
                        parentTask!.subTasks.every((task) => !!task.completedAt)
                    ) {
                        await prisma.eventTask.update({
                            where: { id: parentTask!.id },
                            data: {
                                completedAt: new Date(),
                            },
                        });
                    }
                }

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

                if (task.eventTaskId) {
                    const parentTask = await prisma.eventTask.findUnique({
                        where: { id: task.eventTaskId },
                        include: { subTasks: true },
                    });

                    if (
                        parentTask!.subTasks.every((task) => !task.completedAt)
                    ) {
                        await prisma.eventTask.update({
                            where: { id: parentTask!.id },
                            data: {
                                completedAt: null,
                            },
                        });
                    }
                }

                return Response.ok(task);
            }
        });

    export const updateTask = route
        .patch("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    id: t.string,
                    data: t.partial({
                        title: t.string,
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
