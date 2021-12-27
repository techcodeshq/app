import {
  IconButton,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { BsFillCalendarEventFill, BsFillPersonLinesFill } from "react-icons/bs";
import { DashboardTabs, useDashboard } from "../dashboard/context";

export const TabButtons: React.FC = () => {
  const { selectedTab, setSelectedTab } = useDashboard();

  return (
    <VStack>
      <IconButton
        aria-label="View Members"
        variant={selectedTab === DashboardTabs.MEMBERS ? "solid" : "ghost"}
        icon={<BsFillPersonLinesFill />}
        onClick={() => setSelectedTab(DashboardTabs.MEMBERS)}
      />
      <IconButton
        aria-label="View Members"
        variant={selectedTab === DashboardTabs.EVENTS ? "solid" : "ghost"}
        icon={<BsFillCalendarEventFill />}
        onClick={() => setSelectedTab(DashboardTabs.EVENTS)}
      />
    </VStack>
  );
};
