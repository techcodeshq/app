import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { Perm } from "@prisma/client";
import { createElement } from "react";
import { IconType } from "react-icons";

interface Section {
  name: string;
  perms: Perm[];
  component: React.FC;
  icon: IconType;
}

export const SettingsTabLayout: React.FC<{
  sections: Section[];
}> = ({ sections }) => {
  const smallScreen = useBreakpointValue({
    base: true,
    lg: false,
  });

  return (
    <Tabs>
      {/* TODO: fix tab design */}
      <Flex display={smallScreen ? "block" : "flex"}>
        <TabList
          display="flex"
          // top-down tab list on larger screens
          flexDirection={{ lg: "column" }}
          // full-width tab list on smaller screens, top-down on larger screens
          width={{ lg: "400px" }}
          // width="30%" the width changes by like 2 pixels when switching tabs so yeah figure that out
          // disable default border
          borderBottomWidth="0"
          mt="4"
          p="2"
          borderRadius="8"
          backgroundColor="bg.700"
          height="100%"
        >
          {sections.map((section) => (
            <RenderIfAllowed key={section.name} perms={section.perms}>
              <Tab
                fontSize="2xl"
                justifyContent="flex-start"
                _selected={{ bgColor: "bg.600", borderRadius: "0.5rem" }}
              >
                {createElement(section.icon, {
                  style: {
                    marginRight: "10px",
                  },
                })}
                {section.name}
              </Tab>
            </RenderIfAllowed>
          ))}
        </TabList>

        <TabPanels>
          {sections.map((section) => (
            <TabPanel key={section.name}>
              <RenderIfAllowed perms={section.perms}>
                {createElement(section.component, {})}
              </RenderIfAllowed>
            </TabPanel>
          ))}
        </TabPanels>
      </Flex>
    </Tabs>
  );
};
