import * as bodyparser from "body-parser";
import { Router } from "express";
import { authRoutes } from "./auth-route";
import { eventsRoutes } from "./events-route";

export const routes = Router()
    .use(bodyparser.json())
    .use("/auth", authRoutes)
    .use("/events", eventsRoutes);
