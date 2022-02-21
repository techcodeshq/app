import {
  Box,
  chakra,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SystemStyleObject,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  Tag,
  UseDisclosureReturn,
  useStyles,
  useTab,
} from "@chakra-ui/react";
import React, { forwardRef } from "react";
import { useBranch } from "./pages/context";
import { BranchRoleSettings } from "./role-settings";

export const BranchSettings: React.FC<{ control: UseDisclosureReturn }> = ({
  control,
}) => {
  const { isOpen, onClose } = control;
  const { branch } = useBranch();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent bgColor="bg.800" h="100vh">
        <ModalCloseButton />
        <ModalBody m="0" p="0">
          <Tabs
            w="100%"
            h="100%"
            orientation="vertical"
            variant="unstyled"
            isLazy
          >
            <Flex
              bgColor="bg.700"
              flex="1"
              alignItems="flex-end"
              p="3rem 4rem"
              gap="1rem"
              flexDir="column"
            >
              <Heading fontWeight="medium" fontSize="1.5rem">
                {branch.name}
              </Heading>
              <TabList
                display="flex"
                gap="0.5rem"
                fontSize="1rem"
                fontWeight="regular"
              >
                <Tab
                  padding="0.5rem 1rem 0.5rem 8rem"
                  _focus={{ boxShadow: "none" }}
                  _selected={{ bgColor: "bg.600", borderRadius: "0.5rem" }}
                >
                  Roles
                </Tab>
              </TabList>
            </Flex>
            <Flex flex="2">
              <TabPanels p="2rem 4rem">
                <TabPanel h="100%">
                  <BranchRoleSettings />
                </TabPanel>
              </TabPanels>
            </Flex>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
