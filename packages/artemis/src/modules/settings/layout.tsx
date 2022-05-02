import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
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

export const SettingsAccordionLayout: React.FC<{
  sections: Section[];
}> = ({ sections }) => {
  return (
    <Tabs>
      <Flex>
        <TabList
          display="flex"
          flexDirection="column"
          width="400px"
          // width="30%" the width changes by like 2 pixels when switching tabs so yeah figure that out
          borderBottomWidth="0"
          mr="8"
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
