import { randomBytes } from "crypto";
import * as t from "io-ts";
import { Parser, Response, route } from "typera-express";
import { prisma } from "../util/prisma";

export module EventsController {
    const NOT_FOUND_CODE = "P2025";

    export const getEvents = route.get("/").handler(async () => {
        const events = await prisma.event.findMany();
        return Response.ok(events);
    });

    export const createEvent = route
        .post("/")
        .use(
            Parser.body(
                t.type({
                    name: t.string,
                    points: t.number,
                })
            )
        )
        .handler(async ({ body }) => {
            const code = randomBytes(3).toString("hex");
            const { name, points } = body;

            const event = await prisma.event.create({
                data: {
                    name,
                    linkCode: code,
                },
            });

            return Response.ok(event);
        });

    export const toggleActive = route
        .patch("/")
        .use(Parser.body(t.type({ id: t.string, enabled: t.boolean })))
        .handler(async ({ body }) => {
            const { id, enabled } = body;
            let event;

            try {
                event = await prisma.event.update({
                    where: {
                        id,
                    },
                    data: {
                        enabled,
                    },
                });
            } catch (err: any) {
                if (err.code === NOT_FOUND_CODE)
                    return Response.notFound({
                        message: "No Event found with ID",
                    });
                throw err;
            }

            return Response.ok(event);
        });
}
