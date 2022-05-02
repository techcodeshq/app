import { Perm } from "@prisma/client";

export const permsMetadata: {
  perm: Perm;
  name: string;
  description: string;
  color: "cyan" | "accent";
}[] = [
  {
    perm: Perm.VIEW_USER,
    name: "View User",
    description: "Allows user to view other users' metadata",
    color: "cyan",
  },
  {
    perm: Perm.VIEW_EVENT_LINK,
    name: "View Event Links",
    description: "Allows users to view the links for all of the events",
    color: "cyan",
  },
  {
    perm: Perm.VIEW_EVENT_TASK,
    name: "View Tasks",
    description: "Allows users to view the tasks for all of the events",
    color: "cyan",
  },
  {
    perm: Perm.VIEW_AUDIT_LOG,
    name: "View Audit Log",
    description: "Allows users to view the audit log for all audits",
    color: "cyan",
  },

  {
    perm: Perm.MANAGE_USERS,
    name: "Manage Users",
    description: "Allows users to edit and manage other users' metadata",
    color: "accent",
  },
  {
    perm: Perm.MANAGE_ROLES,
    name: "Manage Roles",
    description:
      "Allows users to create, update, delete, or grant other users roles",
    color: "accent",
  },
  {
    perm: Perm.MANAGE_EVENT,
    name: "Manage Events",
    description: "Allows users to create, update, or delete all events",
    color: "accent",
  },
  {
    perm: Perm.MANAGE_EVENT_LINK,
    name: "Manage Event Links",
    description:
      "Allows users to create, update, delete, or grant links for all events",
    color: "accent",
  },
  {
    perm: Perm.MANAGE_EVENT_TASK,
    name: "Manage Event Tasks",
    description:
      "Allows users to create, update, delete or assign tasks for all events",
    color: "accent",
  },
];
