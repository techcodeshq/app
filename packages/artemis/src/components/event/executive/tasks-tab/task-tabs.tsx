import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Center,
  Heading,
  Divider,
  Box,
  Flex,
} from "@chakra-ui/react";
import { Chat } from "./chat";
import { TaskInfo } from "./task-info";

export const TaskTabs: React.FC = () => (
  <Tabs
    variant="solid-rounded"
    colorScheme="accent"
    isLazy
    overflowY="auto"
    overflowX="hidden"
    h="100%"
    isFitted
  >
    <Flex flexDir="column" h="100%">
      <TabList flex="1" mb="1rem">
        <Tab>Info</Tab>
        <Tab>Chat</Tab>
      </TabList>
      <TabPanels flex="16" overflow="auto">
        <TabPanel>
          <TaskInfo />
        </TabPanel>
        <TabPanel h="100%">
          <Chat />
        </TabPanel>
      </TabPanels>
    </Flex>
  </Tabs>
);
