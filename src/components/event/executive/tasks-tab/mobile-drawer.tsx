import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
  Stack,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Center,
} from "@chakra-ui/react";
import { Return } from ".";
import { TaskInfo } from "./task-info";
import { TaskTabs } from "./task-tabs";

export const TabMobileDrawer: React.FC<{
  task: Return;
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose, task }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");

  return (
    <Drawer isOpen={isOpen} placement="bottom" size="full" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bgColor={bgColor}>
        <DrawerCloseButton />
        <DrawerHeader>Task Details</DrawerHeader>

        <DrawerBody>
          <TaskTabs />
        </DrawerBody>

        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
