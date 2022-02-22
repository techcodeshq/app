import * as bodyparser from "body-parser";
import { Router as router } from "express";
import { auditRoutes } from "./audit-route";
import { authRoutes } from "./auth-route";
import { chatRoutes } from "./chat-routes";
import { eventsRoutes } from "./events-route";
import { linkRoutes } from "./links-route";
import { taskRoutes } from "./task-routes";
import { userRoutes } from "./user-route";
import { mailRoutes } from "./mail-route";

export const routes = router()
  .use(bodyparser.json())
  .use("/auth", authRoutes)
  .use("/events", eventsRoutes)
  .use("/tasks", taskRoutes)
  .use("/users", userRoutes)
  .use("/links", linkRoutes)
  .use("/chat", chatRoutes)
  .use("/audit", auditRoutes)
  .use("/mail", mailRoutes);
