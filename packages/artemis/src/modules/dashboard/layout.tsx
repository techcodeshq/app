import { DashboardTabs } from "@components/dashboard/executive/context";
import { Layout } from "@components/shared/layout";
import { TabButtons } from "@components/shared/tab-buttons";
import { Sidebar, SidebarBottom, SidebarTop } from "@ui/sidebar";
import { Tabs } from "../tabs";
import { TabsSidebar } from "../tabs/tabs-sidebar";
import { dashboardTabs } from "./tabs";

export const DashboardLayout: React.FC = () => {
  return (
    <Layout title="Dashboard">
      <Tabs tabs={dashboardTabs}>
        <TabsSidebar />
      </Tabs>
    </Layout>
  );
};
