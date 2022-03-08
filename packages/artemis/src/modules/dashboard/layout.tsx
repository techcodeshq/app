import { Layout } from "@components/layout";
import { Tabs } from "../../components/tabs";
import { TabsNavigation } from "../../components/tabs/tabs-navigation";
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
