import { Layout } from "@components/shared/layout";
import { Event } from "@prisma/client";
import { TabsNavigation } from "src/modules/tabs/tabs-navigation";
import { Tabs } from "../../tabs";
import { useEvent } from "./context";
import { eventTabs } from "./tabs";

export const EventLayout: React.FC = ({ children }) => {
  const { event } = useEvent();

  return (
    <Layout title={event.name}>
      <Tabs tabs={eventTabs}>
        <TabsNavigation />
      </Tabs>
      {children}
    </Layout>
  );
};
