import { Auth } from "@modules/auth";
import { DashboardStatisticsView } from "@modules/users/statistics";
import { NextPage } from "next";

const Statistics: NextPage = () => (
  <Auth>
    <DashboardStatisticsView />
  </Auth>
);

export default Statistics;
