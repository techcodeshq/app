import { DeleteIcon } from "@chakra-ui/icons";
import { FaTasks } from "react-icons/fa";
import { AiOutlineBranches } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { Tab } from "../../components/tabs";
import { BsBarChart } from "react-icons/bs";

export const dashboardTabs: Tab[] = [
  {
    name: "Dashboard",
    route: "/dashboard",
    icon: RiDashboardFill,
  },
  {
    name: "Statistics",
    route: "/dashboard/statistics",
    icon: BsBarChart,
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
