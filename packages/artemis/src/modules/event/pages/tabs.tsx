import { Perm } from "@prisma/client";
import {
  BsCalendarEventFill,
  BsLink,
  BsListTask,
  BsPeopleFill,
} from "react-icons/bs";
import { Tab } from "src/modules/tabs";

export const eventTabs: Tab[] = [
  {
    name: "Tasks",
    route: "/event/[slug]/tasks/[[...id]]",
    icon: BsListTask,
    perms: [Perm.VIEW_EVENT_TASK],
  },
  {
    name: "Links",
    route: "/event/[slug]/links",
    icon: BsLink,
    perms: [Perm.VIEW_EVENT_LINK],
  },
];
