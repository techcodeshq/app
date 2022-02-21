import { Sidebar, SidebarBottom, SidebarTop } from "@ui/sidebar";
import { TabsButtons } from "./tab-buttons";

export const TabsSidebar: React.FC = ({ children }) => {
  return (
    <Sidebar>
      <SidebarTop>
        <TabsButtons />
      </SidebarTop>
      <SidebarBottom>{children}</SidebarBottom>
    </Sidebar>
  );
};
