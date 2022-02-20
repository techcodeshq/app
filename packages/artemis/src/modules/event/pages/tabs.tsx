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
  },
  {
    name: "Links",
    route: "/event/[slug]/links",
    icon: BsLink,
  },
];
