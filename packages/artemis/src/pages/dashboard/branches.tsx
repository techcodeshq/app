import { Auth } from "@modules/auth";
import { DashboardBranchesView } from "src/modules/branch/dashboard";

export default () => {
  return (
    <Auth>
      <DashboardBranchesView />
    </Auth>
  );
};
