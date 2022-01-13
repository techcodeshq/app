import { IconButton, Tooltip, VStack } from "@chakra-ui/react";
import React from "react";
import {
  BsFillCalendarEventFill,
  BsFillPersonLinesFill,
  BsLink,
  BsListTask,
} from "react-icons/bs";
import { EventTabs, useEvent } from "./context";

export const TabButtons: React.FC = () => {
  const { selectedTab, setSelectedTab } = useEvent();

  return (
    <VStack>
      <Tooltip label="View Links" placement="right">
        <IconButton
          aria-label="View Links"
          variant={selectedTab === EventTabs.LINKS ? "solid" : "ghost"}
          icon={<BsLink />}
          onClick={() => setSelectedTab(EventTabs.LINKS)}
        />
      </Tooltip>
      <Tooltip label="View Tasks" placement="right">
        <IconButton
          aria-label="View Tasks"
          variant={selectedTab === EventTabs.TASKS ? "solid" : "ghost"}
          icon={<BsListTask />}
          onClick={() => setSelectedTab(EventTabs.TASKS)}
        />
      </Tooltip>
    </VStack>
  );
};
