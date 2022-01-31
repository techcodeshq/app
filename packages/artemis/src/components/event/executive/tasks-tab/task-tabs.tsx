import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Center,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { Chat } from "./chat";
import { TaskInfo } from "./task-info";

export const TaskTabs: React.FC = () => (
  <Tabs
    variant="soft-rounded"
    colorScheme="accent"
    w="100%"
    h="100%"
    isLazy
    overflowY="scroll"
    overflowX="hidden"
  >
    <TabList h="5%">
      <Tab>Info</Tab>
      <Tab>Chat</Tab>
    </TabList>
    <Divider p="0.5rem" />
    <TabPanels h="95%">
      <TabPanel>
        <TaskInfo />
      </TabPanel>
      <TabPanel h="100%">
        <Chat />
      </TabPanel>
    </TabPanels>
  </Tabs>
);
