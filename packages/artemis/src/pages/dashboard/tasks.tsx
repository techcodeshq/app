import { Auth } from "@modules/auth";
import { DashboardTasksView } from "@modules/tasks/dashboard";
import { NextPage } from "next";

const Tasks: NextPage = () => (
  <Auth>
    <DashboardTasksView />
  </Auth>
);

export default Tasks;
