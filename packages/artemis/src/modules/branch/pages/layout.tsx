import { SettingsIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { DashboardTabs } from "@components/dashboard/executive/context";
import { Layout } from "@components/shared/layout";
import { TabButtons } from "@components/shared/tab-buttons";
import { Branch } from "@prisma/client";
import { Sidebar, SidebarBottom, SidebarTop } from "@ui/sidebar";
import { TooltipButton } from "@ui/tooltip-button";
import { TabsSidebar } from "src/modules/tabs/tabs-sidebar";
import { Tabs } from "../../tabs";
import { BranchProvider } from "./context";
import { branchTabs } from "./tabs";

export const BranchLayout: React.FC<{ branch: Branch }> = ({
  children,
  branch,
}) => {
  const branchSettings = useDisclosure();

  return (
    <Layout title={branch.name}>
      <Tabs tabs={branchTabs}>
        <TabsSidebar>
          <TooltipButton
            onClick={branchSettings.onOpen}
            label="Settings"
            placement="right"
            icon={<SettingsIcon />}
            variant="ghost"
          />
        </TabsSidebar>
      </Tabs>
      <BranchProvider branch={branch} branchSettings={branchSettings}>
        {children}
      </BranchProvider>
    </Layout>
  );
};
