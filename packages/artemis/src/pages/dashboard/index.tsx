import { Auth } from "@modules/auth";
import { DashboardView } from "@modules/dashboard";
import { NextPage } from "next";
import React from "react";

const Dashboard: NextPage = () => (
  <Auth>
    <DashboardView />
  </Auth>
);

export default Dashboard;
