import * as bodyparser from "body-parser";
import { Router as router } from "express";
import { authRoutes } from "./auth-route";
import { eventsRoutes } from "./events-route";
import { taskRoutes } from "./task-routes";
import { userRoutes } from "./user-route";

export const routes = router()
    .use(bodyparser.json())
    .use("/auth", authRoutes)
    .use("/events", eventsRoutes)
    .use("/tasks", taskRoutes)
    .use("/users", userRoutes);
