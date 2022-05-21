import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
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
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { BiBookAlt } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { useTabs } from ".";

export const TabDrawer: React.FC<{
  control?: UseDisclosureReturn;
}> = ({ control }) => {
  const { tabs, selectedTab } = useTabs();
  const menuColor = useColorModeValue("bg.100", "bg.900");
  const rootColor = useColorModeValue("bg.50", "bg.800");
  // control will never be changed
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isOpen, onOpen, onClose } = control ?? useDisclosure();
  const router = useRouter();

  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={<HamburgerIcon />}
        aria-label="menu"
        bgColor="bg.700"
      >
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
                {tabs.map((tab, index) => (
                  <React.Fragment key={index}>
                    <HStack
                      onClick={() =>
                        router.push({
                          pathname: tab.route,
                          query: router.query,
                        })
                      }
                      p="1rem"
                      borderRadius="0.4rem"
                      bgColor={tab === selectedTab ? rootColor : null}
                      _hover={{ cursor: "pointer" }}
                      w="100%"
                    >
                      <tab.icon />
                      <Text fontWeight="500">{tab.name}</Text>
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
