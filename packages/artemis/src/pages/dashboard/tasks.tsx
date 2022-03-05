import { Auth } from "@modules/auth";
import { DashboardTasksView } from "@modules/tasks/dashboard";

export default () => (
  <Auth>
    <DashboardTasksView />
  </Auth>
);
