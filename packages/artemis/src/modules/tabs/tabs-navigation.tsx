import { useIsMobile } from "@hooks/useIsMobile";
import {
  Sidebar,
  SidebarBottom,
  SidebarTop,
  Topbar,
  TopbarLeft,
  TopbarRight,
} from "@ui/sidebar";
import { TabsButtons } from "./tab-buttons";
import { TabDrawer } from "./tab-menu";

export const TabsNavigation: React.FC = ({ children }) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Sidebar>
        <SidebarTop>
          <TabsButtons />
        </SidebarTop>
        <SidebarBottom>{children}</SidebarBottom>
      </Sidebar>
    );
  }

  return (
    <Topbar>
      <TopbarLeft />
      <TopbarRight signOutBtn={false}>
        {children}
        <TabDrawer />
      </TopbarRight>
    </Topbar>
  );
};
