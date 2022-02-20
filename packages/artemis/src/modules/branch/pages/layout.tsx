import { DashboardTabs } from "@components/dashboard/executive/context";
import { Layout } from "@components/shared/layout";
import { TabButtons } from "@components/shared/tab-buttons";
import { Branch } from "@prisma/client";
import { Sidebar, SidebarBottom, SidebarTop } from "@ui/sidebar";
import { TabsSidebar } from "src/modules/tabs/tabs-sidebar";
import { Tabs } from "../../tabs";
import { BranchProvider } from "./context";
import { branchTabs } from "./tabs";

export const BranchLayout: React.FC<{ branch: Branch }> = ({
  children,
  branch,
}) => {
  return (
    <Layout title="Branch">
      <Tabs tabs={branchTabs}>
        <TabsSidebar />
      </Tabs>
      <BranchProvider branch={branch}>{children}</BranchProvider>
    </Layout>
  );
};
