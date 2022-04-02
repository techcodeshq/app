import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { useIsMobile } from "@hooks/useIsMobile";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { FormSettings } from "@modules/form/form-settings";
import { Perm } from "@prisma/client";
import React from "react";
import { BranchInfoSettings } from "./edit-branch";
import { useBranch } from "./pages/context";
import { BranchRoleSettings } from "./role-settings";

export const BranchSettings: React.FC<{ control: UseDisclosureReturn }> = ({
  control,
}) => {
  const { isOpen, onClose } = control;
  const { branch } = useBranch();
  const isMobile = useIsMobile();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent bgColor="bg.800" h="100vh">
        <Tabs
          variant="unstyled"
          isLazy
          overflow={{ base: "auto", md: "hidden" }}
        >
          {isMobile && (
            <ModalHeader
              p="1rem"
              d="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Heading fontWeight="medium" fontSize="1.5rem">
                Settings
              </Heading>
              <Flex alignItems="center">
                <Menu>
                  <MenuButton
                    as={IconButton}
                    bgColor="bg.700"
                    _hover={{ bgColor: "bg.600" }}
                    icon={<ChevronDownIcon />}
                  />
                  <MenuList bgColor="bg.800">
                    <TabList as={Stack}>
                      <Tab
                        p="0.5rem"
                        _hover={{ bgColor: "bg.700" }}
                        _selected={{
                          bgColor: "bg.700",
                        }}
                      >
                        Overview
                      </Tab>
                      <Tab
                        p="0.5rem"
                        _hover={{ bgColor: "bg.700" }}
                        _selected={{
                          bgColor: "bg.700",
                        }}
                      >
                        Roles
                      </Tab>
                      <Divider />
                      <ModalCloseButton
                        as={Button}
                        w="100%"
                        bgColor="bg.800"
                        fontSize="1rem"
                      >
                        Close
                      </ModalCloseButton>
                    </TabList>
                  </MenuList>
                </Menu>
              </Flex>
            </ModalHeader>
          )}
          <ModalBody m="0" p="0" w="100%" display="flex">
            {!isMobile && (
              <Flex
                bgColor="bg.700"
                flex="0.5"
                h="100vh"
                alignItems="flex-end"
                p="3rem 4rem"
                gap="1rem"
                flexDir="column"
              >
                <ModalCloseButton
                  position="absolute"
                  top="1rem"
                  right="1rem"
                  _focus={{ boxShadow: "none" }}
                  fontSize="1rem"
                  display="flex"
                  gap="0.1rem"
                />
                <Heading fontWeight="medium" fontSize="1.5rem">
                  {branch.name}
                </Heading>
                <TabList
                  display="flex"
                  flexDir="column"
                  gap="0.5rem"
                  fontSize="1rem"
                  fontWeight="regular"
                >
                  <RenderIfAllowed perms={[Perm.MANAGE_BRANCH]}>
                    <Tab
                      padding="0.5rem 1rem 0.5rem 8rem"
                      _focus={{ boxShadow: "none" }}
                      _selected={{ bgColor: "bg.600", borderRadius: "0.5rem" }}
                    >
                      Overview
                    </Tab>
                    <Tab
                      padding="0.5rem 1rem 0.5rem 8rem"
                      _focus={{ boxShadow: "none" }}
                      _selected={{ bgColor: "bg.600", borderRadius: "0.5rem" }}
                    >
                      Roles
                    </Tab>
                    <Tab
                      padding="0.5rem 1rem 0.5rem 8rem"
                      _focus={{ boxShadow: "none" }}
                      _selected={{ bgColor: "bg.600", borderRadius: "0.5rem" }}
                    >
                      Form
                    </Tab>
                  </RenderIfAllowed>
                </TabList>
              </Flex>
            )}
            <Flex flex="2">
              <TabPanels p={{ base: null, md: "2rem 0", lg: "2rem 4rem" }}>
                <TabPanel h="100%">
                  <RenderIfAllowed perms={[Perm.MANAGE_BRANCH]}>
                    <BranchInfoSettings />
                  </RenderIfAllowed>
                </TabPanel>
                <TabPanel h="100%">
                  <RenderIfAllowed perms={[Perm.MANAGE_BRANCH]}>
                    <BranchRoleSettings />
                  </RenderIfAllowed>
                </TabPanel>
                <TabPanel h="100%">
                  <RenderIfAllowed perms={[Perm.MANAGE_BRANCH]}>
                    <FormSettings />
                  </RenderIfAllowed>
                </TabPanel>
              </TabPanels>
            </Flex>
          </ModalBody>
        </Tabs>
      </ModalContent>
    </Modal>
  );
};
