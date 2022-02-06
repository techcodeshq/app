import { AuditLogAction, AuditLogEntity, User } from "@prisma/client";
import { authorized } from "../middlewares/authenticated";
import { prisma } from "./prisma";

export type Audit = {
  author: User;
  action: AuditLogAction;
  entity: AuditLogEntity;
  description?: string;
};

export const audit = async (data: Audit) => {
  return await prisma.auditLogEntry.create({
    data: {
      author: {
        connect: {
          id: data.author.id,
        },
      },
      action: data.action,
      entity: data.entity,
      description: data.description,
    },
  });
};
