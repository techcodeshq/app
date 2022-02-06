import { AuditLogAction, AuditLogEntity, User } from "@prisma/client";
import { prisma } from "./prisma";

export type Audit = {
  author: User;
  action: AuditLogAction;
  entity: AuditLogEntity;
};

export const audit = async (data: Audit) => {
  return await prisma.auditLogEntry.create({
    data,
  });
};
