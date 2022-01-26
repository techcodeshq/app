import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { EventTabs } from "@components/event/executive/context";
import { signOut } from "next-auth/react";
import { Router, useRouter } from "next/router";
import React from "react";
import { FiLogOut } from "react-icons/fi";
import { DashboardTabs } from "../dashboard/executive/context";

export const NavMenu: React.FC<{
  tabs: typeof EventTabs | typeof DashboardTabs;
}> = ({ tabs }) => {
  const menuColor = useColorModeValue("bg.100", "bg.800");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <>
      <IconButton onClick={onOpen} icon={<HamburgerIcon />} aria-label="menu">
        Open
      </IconButton>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bgColor={menuColor}>
          <DrawerHeader m="0.5rem" pl="0">
            Menu
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody m="0.5rem" p="0">
            <Flex flexDir="column" justifyContent="space-between" h="100%">
              <Stack>
                {Object.values(tabs).map((value, index) => (
                  <>
                    <HStack
                      onClick={() => {
                        router.push(value.getPushRoute(router));
                      }}
                      p="0.5rem"
                      borderRadius="0.4rem"
                      bgColor={
                        value.isSelected(router.asPath) ? "bg.900" : null
                      }
                      w="100%"
                    >
                      <value.icon />
                      <Button key={index} variant="ghost">
                        {value.publicName}
                      </Button>
                    </HStack>
                    <Divider />
                  </>
                ))}
              </Stack>
              <Stack>
                <Divider />
                <HStack
                  onClick={() => {
                    router.push("/settings");
                  }}
                  p="0.5rem"
                  borderRadius="0.4rem"
                  w="100%"
                >
                  <SettingsIcon />
                  <Button variant="ghost">Settings</Button>
                </HStack>
                <Divider />
                <HStack
                  onClick={() => {
                    signOut();
                  }}
                  p="0.5rem"
                  borderRadius="0.4rem"
                  w="100%"
                >
                  <FiLogOut />
                  <Button variant="ghost">Log Out</Button>
                </HStack>
              </Stack>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
