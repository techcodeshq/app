import { Box, Flex, Heading, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { DashboardTabs, useDashboard } from "./context";
import { TabHeading } from "./member-heading";
import { MembersGrid } from "./members-grid";
import { MembersTab } from "./members-tab";

const Tabs: React.FC = ({}) => {
  const { selectedTab, setSelectedTab } = useDashboard();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "e") {
        event.preventDefault();
        return setSelectedTab(DashboardTabs.EVENTS);
      } else if (event.ctrlKey && event.key === "m")
        return setSelectedTab(DashboardTabs.MEMBERS);
    });
  }, []);

  switch (selectedTab) {
    case DashboardTabs.MEMBERS:
      return <MembersTab />;
    case DashboardTabs.EVENTS:
      return (
        <Flex width="100%" flexDirection="column" height="100%">
          {!isMobile && <TabHeading />}
          <Heading fontSize="1.5rem" fontWeight="regular" mt="2rem">
            Coming soon to a TechCodes app near you!
          </Heading>
        </Flex>
      );
  }
};

export default Tabs;
