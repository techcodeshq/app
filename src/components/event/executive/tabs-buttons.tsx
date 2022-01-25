import { VStack } from "@chakra-ui/react";
import { TooltipButton } from "@components/ui/tooltip-button";
import { useRouter } from "next/router";
import React from "react";
import { BsLink, BsListTask } from "react-icons/bs";
import { EventTabs, useEvent } from "./context";

export const TabButtons: React.FC = () => {
  const { event } = useEvent();
  const router = useRouter();

  return (
    <VStack>
      <TooltipButton
        label="View Links"
        placement="right"
        variant={EventTabs.LINKS.isSelected(router.asPath) ? "solid" : "ghost"}
        icon={<BsLink />}
        onClick={() => {
          router.push(`/event/${event.slug}${EventTabs.LINKS.url}`);
        }}
      />
      <TooltipButton
        label="View Tasks"
        placement="right"
        variant={EventTabs.TASKS.isSelected(router.asPath) ? "solid" : "ghost"}
        icon={<BsListTask />}
        onClick={() => {
          router.push(`/event/${event.slug}${EventTabs.TASKS.url}`);
        }}
      />
    </VStack>
  );
};
