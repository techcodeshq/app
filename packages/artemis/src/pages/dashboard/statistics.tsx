import { Auth } from "@modules/auth";
import { DashboardStatisticsView } from "@modules/users/statistics";

export default () => (
  <Auth>
    <DashboardStatisticsView />
  </Auth>
);
