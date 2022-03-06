import { Auth } from "@modules/auth";
import { DashboardStatisticsView } from "@modules/dashboard/statistics";

export default () => (
  <Auth>
    <DashboardStatisticsView />
  </Auth>
);
