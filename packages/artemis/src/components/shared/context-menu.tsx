import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  Stack,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import router from "next/router";
import { MutableRefObject } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

export const ContextMenu: React.FC<{}> = ({ children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const bgColor = useColorModeValue("bg.200", "bg.700");
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!isMobile) {
    return (
      <Menu onClose={onClose}>
        <MenuButton
          as={IconButton}
          variant="ghost"
          icon={<BsThreeDotsVertical />}
          aria-label="options"
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
        <MenuList
          shadow="md"
          bgColor={bgColor}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {children}
        </MenuList>
      </Menu>
    );
  }

  return (
    <>
      <IconButton
        variant="ghost"
        icon={<BsThreeDotsVertical />}
        aria-label="options"
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
      />
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bgColor={bgColor}>
          <DrawerHeader onClick={onClose}>
            <Center>
              <ChevronDownIcon />
            </Center>
          </DrawerHeader>
          <Divider />
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
