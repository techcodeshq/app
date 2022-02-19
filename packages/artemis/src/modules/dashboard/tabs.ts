import { DeleteIcon } from "@chakra-ui/icons";
import { FaTasks } from "react-icons/fa";
import { AiOutlineBranches } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { Tab } from "../tabs";

export const dashboardTabs: Tab[] = [
  {
    name: "Dashboard",
    route: "/dashboard",
    icon: RiDashboardFill,
  },
  {
    name: "Tasks",
    route: "/dashboard/tasks",
    icon: FaTasks,
  },
  {
    name: "Branches",
    route: "/dashboard/branches",
    icon: AiOutlineBranches,
  },
];
