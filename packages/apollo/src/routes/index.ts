import * as bodyparser from "body-parser";
import { Router as router } from "express";
import { auditRoutes } from "./audit-route";
import { authRoutes } from "./auth-route";
import { eventsRoutes } from "./events-route";
import { linkRoutes } from "./links-route";
import { roleRoutes } from "./roles-route";
import { taskRoutes } from "./task-route";
import { userRoutes } from "./users-route";

export const routes = router()
  .use(bodyparser.json())
  .use("/auth", authRoutes)
  .use("/events", eventsRoutes)
  .use("/tasks", taskRoutes)
  .use("/users", userRoutes)
  .use("/links", linkRoutes)
  .use("/audit", auditRoutes)
  .use("/roles", roleRoutes);
