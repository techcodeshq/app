import { VStack } from "@chakra-ui/react";
import { TooltipButton } from "@ui/tooltip-button";
import { useRouter } from "next/router";
import { useTabs } from ".";

export const TabsButtons: React.FC = () => {
  const { tabs, selectedTab } = useTabs();
  const router = useRouter();

  return (
    <VStack>
      {tabs.map((tab, index) => (
        <TooltipButton
          key={index}
          label={`View ${tab.name}`}
          placement="right"
          variant="ghost"
          color={tab === selectedTab ? "accent.300" : "text.200"}
          icon={<tab.icon />}
          onClick={() => router.push(tab.route)}
        />
      ))}
    </VStack>
  );
};
