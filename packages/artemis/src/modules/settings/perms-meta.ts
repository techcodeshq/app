import { Perm } from "@prisma/client";

export const permsMetadata: {
  perm: Perm;
  name: string;
  description: string;
  color: "cyan" | "accent";
}[] = [
  {
    perm: Perm.VIEW_EVENT_LINK,
    name: "View Event Links",
    description:
      "Allows members to view the links for all of the events in this branch",
    color: "cyan",
  },
  {
    perm: Perm.VIEW_EVENT_TASK,
    name: "View Tasks",
    description:
      "Allows members to view the tasks for all of the events in this branch",
    color: "cyan",
  },
  {
    perm: Perm.VIEW_AUDIT_LOG,
    name: "View Audit Log",
    description:
      "Allows members to view the audit log for all audits in this branch",
    color: "cyan",
  },

  {
    perm: Perm.MANAGE_EVENT,
    name: "Manage Events",
    description:
      "Allows members to create, update, or delete all of the events in this branch",
    color: "accent",
  },
  {
    perm: Perm.MANAGE_EVENT_LINK,
    name: "Manage Event Links",
    description:
      "Allows members to create, update, delete, or grant links for all of the events in this branch",
    color: "accent",
  },
  {
    perm: Perm.MANAGE_EVENT_TASK,
    name: "Manage Event Tasks",
    description:
      "Allows members to create, update, delete or assign tasks for all of the events in this branch",
    color: "accent",
  },
];
