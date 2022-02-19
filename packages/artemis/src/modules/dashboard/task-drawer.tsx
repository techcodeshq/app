import {
  Avatar,
  Text,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useColorModeValue,
  HStack,
  VStack,
  Flex,
} from "@chakra-ui/react";

export const TaskDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const bgColor = useColorModeValue("bg.100", "bg.900");

  return (
    <Drawer isOpen={isOpen} placement="right" size="lg" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bgColor={bgColor} p="1rem">
        <DrawerHeader>
          <Flex alignItems="center" gap="0.5rem">
            <Avatar />
            <Flex flexDir="column" fontSize="1rem" fontWeight="normal">
              <Text>George Washington Carver</Text>
              <Text opacity="50%">gcwashington@techcodes.org</Text>
            </Flex>
          </Flex>
        </DrawerHeader>

        <DrawerBody></DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
