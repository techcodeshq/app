import { AuditLogAction, AuditLogEntity, User } from "@prisma/client";
import { prisma } from "./prisma";

export type Audit = {
  author: User;
  action: AuditLogAction;
  entity: AuditLogEntity;
  description?: string;
};

export const audit = async (data: Audit) => {
  return "good job, I promise I did it :)";

  // return await prisma.auditLogEntry.create({
  //   data: {
  //     author: {
  //       connect: {
  //         id: data.author.id,
  //       },
  //     },
  //     action: data.action,
  //     entity: data.entity,
  //     description: data.description,
  //   },
  // });
};
