import { VStack } from "@chakra-ui/react";
import { TooltipButton } from "@components/ui/tooltip-button";
import React from "react";
import { BsFillCalendarEventFill, BsFillPersonLinesFill } from "react-icons/bs";
import { DashboardTabs, useDashboard } from "./context";

export const TabButtons: React.FC = () => {
  const { selectedTab, setSelectedTab } = useDashboard();

  return (
    <VStack>
      <TooltipButton
        label="View Events"
        placement="right"
        variant={selectedTab === DashboardTabs.EVENTS ? "solid" : "ghost"}
        icon={<BsFillCalendarEventFill />}
        onClick={() => setSelectedTab(DashboardTabs.EVENTS)}
      />
      <TooltipButton
        label="View Members"
        placement="right"
        variant={selectedTab === DashboardTabs.MEMBERS ? "solid" : "ghost"}
        icon={<BsFillPersonLinesFill />}
        onClick={() => setSelectedTab(DashboardTabs.MEMBERS)}
      />
    </VStack>
  );
};
