import { Perm } from "@prisma/client";

export const permsMetadata: {
  perm: Perm;
  name: string;
  description: string;
}[] = [
  {
    perm: Perm.VIEW_USER,
    name: "View Members",
    description:
      "Allows members to view all of the members of this branch, including their metadata",
  },
  {
    perm: Perm.VIEW_EVENT_LINK,
    name: "View Event Links",
    description:
      "Allows members to view the links for all of the events in this branch",
  },
  {
    perm: Perm.VIEW_EVENT_TASK,
    name: "View Tasks",
    description:
      "Allows members to view the tasks for all of the events in this branch",
  },
  {
    perm: Perm.VIEW_AUDIT_LOG,
    name: "View Audit Log",
    description:
      "Allows members to view the audit log for all audits in this branch",
  },
  {
    perm: Perm.MANAGE_USER,
    name: "Manage Members",
    description:
      "Allows members to modify or delete all of the members in this branch, including their metadata",
  },
  {
    perm: Perm.MANAGE_EVENT,
    name: "Manage Events",
    description:
      "Allows members to create, update, or delete all of the events in this branch",
  },
  {
    perm: Perm.MANAGE_EVENT_LINK,
    name: "Manage Event Links",
    description:
      "Allows members to create, update, delete, or grant links for all of the events in this branch",
  },
  {
    perm: Perm.MANAGE_EVENT_TASK,
    name: "Manage Event Tasks",
    description:
      "Allows members to create, update, delete or assign tasks for all of the events in this branch",
  },
  {
    perm: Perm.MANAGE_BRANCH,
    name: "Manage Branch",
    description:
      "Grants members administrator access to this branch and all of its resources. They will bypass all specific restrictions.",
  },
];
