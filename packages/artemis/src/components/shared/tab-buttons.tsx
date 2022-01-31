import { VStack } from "@chakra-ui/react";
import { TooltipButton } from "@components/ui/tooltip-button";
import { Tabs } from "@lib/util/tabs";
import { useRouter } from "next/router";

export const TabButtons: React.FC<{ tabs: typeof Tabs }> = ({ tabs }) => {
  const router = useRouter();

  return (
    <VStack>
      {Object.values(tabs).map((tab, index) => (
        <TooltipButton
          key={index}
          label={`View ${tab.publicName}`}
          placement="right"
          variant={tab.isSelected(router.asPath) ? "solid" : "ghost"}
          icon={<tab.icon />}
          onClick={() => router.push(tab.getPushRoute(router))}
        />
      ))}
    </VStack>
  );
};
