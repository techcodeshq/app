import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Center,
  Heading,
} from "@chakra-ui/react";
import { TaskInfo } from "./task-info";

export const TaskTabs: React.FC = () => (
  <Tabs variant="soft-rounded" colorScheme="accent" w="100%">
    <TabList>
      <Tab>Info</Tab>
      <Tab>Chat</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <TaskInfo />
      </TabPanel>
      <TabPanel>
        <Center width="100%">
          <Heading color="gray.600" textAlign="center">
            Chat Coming Soon to a TechCodes app near you!
          </Heading>
        </Center>
      </TabPanel>
    </TabPanels>
  </Tabs>
);
