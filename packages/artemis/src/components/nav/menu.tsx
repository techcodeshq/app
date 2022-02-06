import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
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
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { EventTabs } from "@components/event/executive/context";
import { Role } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { BiBookAlt } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { DashboardTabs } from "../dashboard/executive/context";

export const NavMenu: React.FC<{
  tabs: typeof EventTabs | typeof DashboardTabs;
  control?: UseDisclosureReturn;
}> = ({ tabs, control }) => {
  const menuColor = useColorModeValue("bg.100", "bg.800");
  const rootColor = useColorModeValue("bg.50", "bg.900");
  const { isOpen, onOpen, onClose } = control ?? useDisclosure();
  const router = useRouter();
  const { data: session } = useSession();

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
                  <React.Fragment key={index}>
                    <HStack
                      onClick={() => {
                        router.push(value.getPushRoute(router));
                      }}
                      p="1rem"
                      borderRadius="0.4rem"
                      bgColor={
                        value.isSelected(router.asPath) ? rootColor : null
                      }
                      _hover={{ cursor: "pointer" }}
                      w="100%"
                    >
                      <value.icon />
                      <Text fontWeight="500">{value.publicName}</Text>
                    </HStack>
                    <Divider />
                  </React.Fragment>
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
                  <Text fontWeight="500">Settings</Text>
                </HStack>
                <Divider />
                {session?.user.role === Role.EXEC && (
                  <>
                    <HStack
                      onClick={() => {
                        router.push("/audit-log");
                      }}
                      p="0.5rem"
                      borderRadius="0.4rem"
                      w="100%"
                    >
                      <BiBookAlt />
                      <Text fontWeight="500">Audit Log</Text>
                    </HStack>
                    <Divider />
                  </>
                )}
                <HStack
                  onClick={() => {
                    signOut();
                  }}
                  p="0.5rem"
                  borderRadius="0.4rem"
                  w="100%"
                >
                  <FiLogOut />
                  <Text fontWeight="500">Log Out</Text>
                </HStack>
              </Stack>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
