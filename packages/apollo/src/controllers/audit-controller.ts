import { route, Response } from "typera-express";
import { authenticated } from "../middlewares/authenticated";
import { prisma } from "../util/prisma";

export module AuditController {
  export const getAudits = route
    .get("/")
    .use(authenticated(null))
    .handler(async () => {
      const audits = await prisma.auditLogEntry.findMany({
        include: { author: true },
        orderBy: {
          createdAt: "desc",
        },
      });
      return Response.ok(audits);
    });
}
