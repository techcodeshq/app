import { Layout } from "@components/shared/layout";
import { Tabs } from "../tabs";
import { TabsNavigation } from "../tabs/tabs-navigation";
import { dashboardTabs } from "./tabs";

export const DashboardLayout: React.FC = ({ children }) => {
  return (
    <Layout title="Dashboard">
      <Tabs tabs={dashboardTabs}>
        <TabsNavigation />
      </Tabs>
      {children}
    </Layout>
  );
};
