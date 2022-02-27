import { prisma } from "../util/prisma";
import { route, Parser, Response } from "typera-express";
import * as t from "io-ts";
import { AuditLogAction, AuditLogEntity, Perm } from "@prisma/client";
import { authenticated, authorized } from "../middlewares/authentication";
import { audit } from "../util/audit";

export module TaskController {
  export const getTask = route
    .get("/:taskId")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_EVENT_TASK))
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

  export const getTaskHistory = route
    .get("/history/:id")
    .use(authenticated(null))
    .use(authorized(Perm.VIEW_EVENT_TASK))
    .handler(async ({ routeParams }) => {
      const event = await prisma.event.findUnique({
        where: {
          id: routeParams.id,
        },
      });

      if (event) {
        return Response.ok({
          data: [
            {
              name: "Root",
              taskId: null,
              parent: `/events/tasks/${event.id}`,
              child: `/events/tasks/${event.id}`,
            },
          ],
          idx: 0,
        });
      }

      const tasks = [
        await prisma.eventTask.findUnique({
          where: { id: routeParams.id },
        }),
      ];

      const eventId = tasks[0]?.eventId;

      if (routeParams.id === "undefined") {
        return Response.ok();
      }

      while (tasks[0]?.eventTaskId) {
        tasks.unshift(
          await prisma.eventTask.findUnique({
            where: { id: tasks[0].eventTaskId },
          }),
        );
      }

      const historyTasks = tasks.map((task) => ({
        name: task!.name,
        taskId: task!.id,
        parent: `/tasks/${task!.eventTaskId}`,
        child: `/tasks/${task!.id}`,
      }));

      historyTasks[0].parent = `/events/tasks/${eventId}`;
      return Response.ok({
        data: [
          {
            name: "Root",
            taskId: null,
            parent: `/events/tasks/${eventId}`,
            child: `/events/tasks/${eventId}`,
          },
          ...historyTasks,
        ],
        idx: historyTasks.length,
      });
    });

  export const createTask = route
    .post("/")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_TASK))
    .use(
      Parser.body(
        t.type({
          name: t.string,
          description: t.string,
          baseId: t.string,
          dueDate: t.union([t.string, t.null]),
        }),
      ),
    )
    .handler(async ({ body, user }) => {
      const { name, description, baseId: eventId, dueDate } = body;
      const task = await prisma.eventTask.create({
        data: {
          name,
          description,
          eventId,
          dueDate: dueDate,
        },
      });

      if (!task) {
        return Response.ok({
          error: "INVALID_EVENT",
          description: "Event with that id does not exist",
        });
      }

      await audit({
        author: user,
        action: AuditLogAction.CREATE,
        entity: AuditLogEntity.EVENT_TASK,
        description: `Created Task: ${task.name}`,
      });
      return Response.ok(task);
    });

  export const createSubTask = route
    .post("/sub-task")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_TASK))
    .use(
      Parser.body(
        t.type({
          baseId: t.string,
          name: t.string,
          description: t.string,
          dueDate: t.union([t.string, t.null]),
        }),
      ),
    )
    .handler(async ({ body, user }) => {
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

      await audit({
        author: user,
        action: AuditLogAction.CREATE,
        entity: AuditLogEntity.EVENT_TASK,
        description: `Created Sub-Task: ${createdTask.name} for ${parentTask.name}`,
      });
      return Response.ok(task);
    });

  export const toggleAssignUser = route
    .patch("/assign")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_TASK))
    .use(
      Parser.body(
        t.type({
          taskId: t.string,
          userId: t.string,
          assign: t.boolean,
        }),
      ),
    )
    .handler(async ({ body, user }) => {
      const task = body.assign
        ? await assign(body.taskId, body.userId)
        : await unassign(body.taskId, body.userId);
      delete (task as any).subTasks;

      const assignedUser = await prisma.user.findUnique({
        where: { id: body.userId },
      });

      await audit({
        author: user,
        action: AuditLogAction.UPDATE,
        entity: AuditLogEntity.EVENT_TASK,
        description: `${body.assign ? "Assigned" : "Unassigned"} ${
          task?.name
        } to ${assignedUser!.name}`,
      });
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

  export const deleteTask = route
    .delete("/:taskId")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_TASK))
    .handler(async ({ routeParams, user }) => {
      const task = await prisma.eventTask.delete({
        where: { id: routeParams.taskId },
        include: { subTasks: true, assignees: true },
      });

      await audit({
        author: user,
        action: AuditLogAction.DELETE,
        entity: AuditLogEntity.EVENT_TASK,
        description: `Deleted Task: ${task.name}`,
      });
      return Response.ok(task);
    });

  // TODO: Can toggle your assigned tasks
  export const toggleTask = route
    .patch("/toggle")
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_TASK))
    .use(
      Parser.body(
        t.type({
          taskId: t.string,
          value: t.boolean,
        }),
      ),
    )
    .handler(async ({ body, user }) => {
      if (body.value) {
        const task = await completeTask(body.taskId);
        delete (task as any).subTasks;

        await completeParent(task.eventTaskId);

        await audit({
          author: user,
          action: AuditLogAction.UPDATE,
          entity: AuditLogEntity.EVENT_TASK,
          description: `Toggled ${task.name} to true`,
        });
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
            description: "the provided task ID does not match a valid task",
          });
        }

        await uncompleteParent(task.eventTaskId);

        await audit({
          author: user,
          action: AuditLogAction.UPDATE,
          entity: AuditLogEntity.EVENT_TASK,
          description: `Toggled ${task.name} to false`,
        });
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
    .use(authenticated(null))
    .use(authorized(Perm.MANAGE_EVENT_TASK))
    .use(
      Parser.body(
        t.type({
          id: t.string,
          data: t.partial({
            name: t.string,
            description: t.string,
            dueDate: t.union([t.string, t.null]),
          }),
        }),
      ),
    )
    .handler(async ({ body, user }) => {
      const task = await prisma.eventTask.update({
        where: { id: body.id },
        data: body.data,
      });

      await audit({
        author: user,
        action: AuditLogAction.UPDATE,
        entity: AuditLogEntity.EVENT_TASK,
        description: `Updated Task: ${task.name}`,
      });
      return Response.ok(task);
    });
}
