import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { TooltipButton } from "@components/ui/tooltip-button";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import { EventTask, EventTaskOnUser, User } from "@typings";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsChevronUp, BsTrash } from "react-icons/bs";
import { useEvent } from "../context";
import { AssignUser } from "./assign-user";
import { Chat } from "./chat";
import { useTask } from "./context";
import { CreateTask } from "./create-task";
import { HistoryBar } from "./history-bar";
import { TabMobileDrawer } from "./mobile-drawer";
import { Task } from "./task";
import { TaskInfo } from "./task-info";
import { TaskSection } from "./task-section-accordion";
import { TaskTabs } from "./task-tabs";

const MotionButton = motion(Button);

export type Return = {
  id?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  eventTaskId?: string | null | undefined;
  eventId?: string | undefined;
  dueDate?: string | undefined;
  completedAt?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  subTasks: (EventTask & {
    subTasks: EventTask[];
    assignees: (EventTaskOnUser & {
      user: User;
    })[];
    _count: { subTasks: number };
  })[];
  assignees?:
    | (EventTaskOnUser & {
        user: User;
      })[]
    | undefined;
  isRoot: boolean;
};

export const TasksTab: React.FC<{ taskCreate: UseDisclosureReturn }> = ({
  taskCreate,
}) => {
  const { event } = useEvent();
  const { taskUrl, task } = useTask();

  const {
    isOpen: drawerIsOpen,
    onOpen: drawerOpen,
    onClose: drawerOnClose,
  } = useDisclosure();
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const borderColor = useColorModeValue("bg.200", "black");

  return (
    <Flex
      gap="2rem"
      h="100%"
      width={{ base: null, md: "100%" }}
      flexDir="column"
    >
      <HistoryBar numTasks={task?.subTasks?.length} />
      <Flex
        gap="2rem"
        h="100%"
        overflow={{ base: null, md: "auto" }}
        flexDir={{ base: "column", md: "row" }}
      >
        <Flex flex="1" overflow={{ base: null, md: "auto" }}>
          <Flex flexDir="column" h="100%" w="100%">
            {task && task.subTasks?.length > 0 ? (
              <Accordion
                defaultIndex={[0]}
                allowToggle
                allowMultiple
                padding="5px"
              >
                <TaskSection heading="To Do">
                  <AnimatePresence>
                    <Stack spacing="1rem">
                      {task.subTasks
                        .filter((task) => !task.completedAt)
                        .map((item, index) => (
                          <Task
                            key={item.id}
                            task={item}
                            index={index}
                            refetchUrl={taskUrl}
                          />
                        ))}
                    </Stack>
                  </AnimatePresence>
                </TaskSection>
                <TaskSection heading="Finished">
                  <AnimatePresence>
                    <Stack spacing="1rem">
                      {task.subTasks
                        .filter((task) => task.completedAt)
                        .map((item, index) => (
                          <Task
                            key={item.id}
                            task={item}
                            index={index}
                            refetchUrl={taskUrl}
                          />
                        ))}
                    </Stack>
                  </AnimatePresence>
                </TaskSection>
              </Accordion>
            ) : (
              task?.subTasks?.length === 0 && (
                <Center h="100%">
                  <Heading color="gray.600" textAlign="center">
                    This task has no sub tasks!
                  </Heading>
                </Center>
              )
            )}
          </Flex>
        </Flex>
        {task && !task.isRoot && !isMobile && (
          <Flex
            borderRadius="0.8rem"
            flex="2"
            bgColor={bgColor}
            h="100%"
            maxW="60%"
          >
            <Box p="2rem" w="100%">
              <TaskTabs />
            </Box>
          </Flex>
        )}
      </Flex>
      {task && (
        <CreateTask
          refetchUrl={taskUrl}
          isOpen={taskCreate.isOpen}
          onClose={taskCreate.onClose}
          route={task.isRoot ? "/tasks" : "/tasks/sub-task"}
          id={task.isRoot ? event.id : task.id}
          task={task}
        />
      )}
      {isMobile && task && !task.isRoot && (
        <>
          <Box
            w="100vw"
            h="3rem"
            transition="height 0.25s ease-in"
            _hover={{ h: "3.5rem", cursor: "pointer" }}
            bgColor={bgColor}
            borderTop="0.2rem solid"
            borderColor={borderColor}
            position="fixed"
            bottom={0}
            right={0}
            zIndex={10}
            onClick={drawerOpen}
          >
            <Center h="100%">
              <BsChevronUp />
            </Center>
          </Box>
          <TabMobileDrawer
            isOpen={drawerIsOpen}
            onClose={drawerOnClose}
            task={task}
          />
        </>
      )}
    </Flex>
  );
};