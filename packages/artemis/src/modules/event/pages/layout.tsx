import { SettingsIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { Layout } from "@components/layout";
import { TooltipButton } from "@ui/tooltip-button";
import { TabsNavigation } from "@components/tabs/tabs-navigation";
import { Tabs } from "../../../components/tabs";
import { EventSettings } from "../settings";
import { useEvent } from "./context";
import { eventTabs } from "./tabs";

export const EventLayout: React.FC = ({ children }) => {
  const { event } = useEvent();
  const settings = useDisclosure();

  return (
    <>
      <Layout title={event.name}>
        <Tabs tabs={eventTabs}>
          <TabsNavigation>
            <TooltipButton
              onClick={settings.onOpen}
              label="Settings"
              placement="right"
              icon={<SettingsIcon />}
              variant="ghost"
            />
          </TabsNavigation>
        </Tabs>
        {children}
      </Layout>
      <EventSettings control={settings} />
    </>
  );
};
