import * as bodyparser from "body-parser";
import { Router as router } from "express";
import { authRoutes } from "./auth-route";
import { eventsRoutes } from "./events-route";

export const routes = router()
    .use(bodyparser.json())
    .use("/auth", authRoutes)
    .use("/events", eventsRoutes);
