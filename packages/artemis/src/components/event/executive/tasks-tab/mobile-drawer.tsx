import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { Return } from ".";
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
      </DrawerContent>
    </Drawer>
  );
};
