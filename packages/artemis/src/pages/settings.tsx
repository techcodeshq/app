import { DashboardSettingsView } from "../modules/settings";
import { Auth } from "../modules/auth";

export default () => (
  <Auth>
    <DashboardSettingsView />
  </Auth>
);
