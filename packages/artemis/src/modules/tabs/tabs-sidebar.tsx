import { Sidebar, SidebarBottom, SidebarTop } from "@ui/sidebar";
import { TabsButtons } from "./tab-buttons";

export const TabsSidebar: React.FC = () => {
  return (
    <Sidebar>
      <SidebarTop>
        <TabsButtons />
      </SidebarTop>
      <SidebarBottom />
    </Sidebar>
  );
};
