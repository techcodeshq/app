import { VStack } from "@chakra-ui/react";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { TooltipButton } from "@ui/tooltip-button";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTabs } from ".";

export const TabsButtons: React.FC = () => {
  const { tabs, selectedTab } = useTabs();
  const router = useRouter();

  return (
    <VStack>
      {tabs.map((tab, index) => (
        <RenderIfAllowed perms={tab.perms} key={index}>
          <TooltipButton
            key={index}
            label={`View ${tab.name}`}
            placement="right"
            variant="ghost"
            color={tab === selectedTab ? "accent.300" : "text.200"}
            icon={<tab.icon />}
            onClick={() =>
              router.push({
                pathname: tab.route,
                query: router.query,
              })
            }
          />
        </RenderIfAllowed>
      ))}
    </VStack>
  );
};
