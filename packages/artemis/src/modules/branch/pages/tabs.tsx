import { Perm } from "@prisma/client";
import { BsCalendarEventFill, BsPeopleFill } from "react-icons/bs";
import { Tab } from "src/modules/tabs";

export const branchTabs: Tab[] = [
  {
    name: "Events",
    route: "/branch/[slug]/events",
    icon: BsCalendarEventFill,
  },
  {
    name: "Members",
    route: "/branch/[slug]/members",
    icon: BsPeopleFill,
    perms: [Perm.VIEW_USER],
  },
];
