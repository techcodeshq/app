import { Router, json } from "express";
import { eventsRoutes } from "./events-route";
import * as bodyparser from "body-parser";
import { authRoutes } from "./auth-route";

export const routes = Router()
    .use(bodyparser.json())
    .use("/auth", authRoutes)
    .use("/events", eventsRoutes);
