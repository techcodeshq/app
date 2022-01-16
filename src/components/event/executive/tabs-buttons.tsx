import { VStack } from "@chakra-ui/react";
import { TooltipButton } from "@components/ui/tooltip-button";
import React from "react";
import { BsLink, BsListTask } from "react-icons/bs";
import { EventTabs, useEvent } from "./context";

export const TabButtons: React.FC = () => {
  const { selectedTab, setSelectedTab } = useEvent();

  return (
    <VStack>
      <TooltipButton
        label="View Links"
        placement="right"
        variant={selectedTab === EventTabs.LINKS ? "solid" : "ghost"}
        icon={<BsLink />}
        onClick={() => setSelectedTab(EventTabs.LINKS)}
      />
      <TooltipButton
        label="View Tasks"
        placement="right"
        variant={selectedTab === EventTabs.TASKS ? "solid" : "ghost"}
        icon={<BsListTask />}
        onClick={() => setSelectedTab(EventTabs.TASKS)}
      />
    </VStack>
  );
};
