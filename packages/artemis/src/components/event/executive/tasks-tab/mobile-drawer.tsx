import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDrag } from "@use-gesture/react";
import { Return } from ".";
import { TaskInfo } from "./task-info";
import { TaskTabs } from "./task-tabs";

export const TabMobileDrawer: React.FC<{
  task: Return;
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose, task }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const bind: any = useDrag(
    ({ direction, distance, elapsedTime, ...state }) => {
      if (
        elapsedTime < 15 ||
        distance[1] < 8 ||
        !["touchend", "pointerup"].includes(state.event.type)
      )
        return;

      console.log(direction, distance, elapsedTime);
      if (isOpen && direction[1] === 1) {
        onClose();
      }
    },
    { axis: "y", pointer: { touch: true } },
  );

  return (
    <Drawer isOpen={isOpen} placement="bottom" size="full" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bgColor={bgColor} {...bind()}>
        <DrawerCloseButton />
        <DrawerHeader>Task Details</DrawerHeader>

        <DrawerBody>
          <TaskInfo />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
