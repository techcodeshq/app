import { Role } from "@prisma/client";
import * as t from "io-ts";
import { Parser, Response, route } from "typera-express";
import { authenticated, authorized } from "../middlewares/authenticated";
import { prisma } from "../util/prisma";

export module EventsController {
    // const NOT_FOUND_CODE = "P2025";
    export const getEvents = route
        .get("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async () => {
            const events = await prisma.event.findMany();
            return Response.ok(events);
        });

    export const getEventBySlug = route
        .get("/:slug")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const event = await prisma.event.findUnique({
                where: { slug: routeParams.slug },
            });
            return Response.ok(event);
        });

    export const createEvent = route
        .post("/")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .use(
            Parser.body(
                t.type({
                    name: t.string,
                    description: t.string,
                    date: t.string,
                }),
            ),
        )
        .handler(async ({ body }) => {
            const { name, description, date } = body;

            const event = await prisma.event.create({
                data: {
                    name,
                    description,
                    slug: await generateSlug(name),
                    color: generateRandomColor(),
                    date: new Date(date),
                },
            });

            return Response.ok(event);
        });

    const generateSlug = async (name: string) => {
        const slug = name
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        const events = await prisma.event.findMany({ where: { slug } });

        if (events.length > 0) {
            return slug + events.length;
        }

        return slug;
    };

    const generateRandomColor = () => {
        let [h, s, l] = [360 * Math.random(), 70, 70];

        l /= 100;
        const a = (s * Math.min(l, 1 - l)) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color)
                .toString(16)
                .padStart(2, "0"); // convert to Hex and prefix "0" if needed
        };

        return `${f(0)}${f(8)}${f(4)}`;
    };
    export const getTasks = route
        .get("/tasks/:eventId")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const tasks = await prisma.eventTask.findMany({
                where: { eventTaskId: null, eventId: routeParams.eventId },
                include: {
                    subTasks: {
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                    assignees: { include: { user: true } },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return Response.ok({ subTasks: tasks });
        });

    export const deleteEvent = route
        .delete("/:id")
        .use(authenticated)
        .use(authorized([Role.EXEC]))
        .handler(async ({ routeParams }) => {
            const event = await prisma.event.findUnique({
                where: { id: routeParams.id },
                include: { links: true },
            });

            if (event!.links.length > 0) {
                return Response.ok({
                    error: "EVENT_HAS_LINKS",
                    description:
                        "this event has links, please delete them first",
                });
            }

            await prisma.event.delete({
                where: { id: routeParams.id },
            });

            return Response.ok(event);
        });
}
