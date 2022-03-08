import { Perm } from "@prisma/client";
import { BsCalendarEventFill, BsPeopleFill } from "react-icons/bs";
import { Tab } from "@components/tabs";

export const branchTabs: Tab[] = [
  {
    name: "Events",
    route: "/branch/[slug]/events",
    icon: BsCalendarEventFill,
    query: ["slug"],
  },
  {
    name: "Members",
    route: "/branch/[slug]/members",
    icon: BsPeopleFill,
    query: ["slug"],
    perms: [Perm.VIEW_MEMBER],
  },
];
