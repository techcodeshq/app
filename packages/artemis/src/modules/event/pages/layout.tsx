import { DashboardTabs } from "@components/dashboard/executive/context";
import { Layout } from "@components/shared/layout";
import { TabButtons } from "@components/shared/tab-buttons";
import { Branch } from "@prisma/client";
import { Sidebar, SidebarBottom, SidebarTop } from "@ui/sidebar";
import { TabsSidebar } from "src/modules/tabs/tabs-sidebar";
import { Tabs } from "../../tabs";
import { EventProvider } from "./context";
import { eventTabs } from "./tabs";
import { Event } from "@prisma/client";

export const EventLayout: React.FC<{ event: Event }> = ({
  children,
  event,
}) => {
  return (
    <Layout title={event.name}>
      <Tabs tabs={eventTabs}>
        <TabsSidebar />
      </Tabs>
      <EventProvider event={event}>{children}</EventProvider>
    </Layout>
  );
};
