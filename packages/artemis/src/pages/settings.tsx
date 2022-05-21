import { DashboardSettingsView } from "../modules/settings";
import { Auth } from "../modules/auth";
import { NextPage } from "next";

const Settings: NextPage = () => (
  <Auth>
    <DashboardSettingsView />
  </Auth>
);

export default Settings;
