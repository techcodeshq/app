import {
  Accordion,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { EventTask, EventTaskOnUser, User } from "@prisma/client";
import { useDrag } from "@use-gesture/react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { BsChevronUp } from "react-icons/bs";
import { useEvent } from "../context";
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

  const bind: any = useDrag(
    ({ direction, distance, elapsedTime, ...state }) => {
      if (
        elapsedTime < 15 ||
        distance[1] < 8 ||
        !["touchend", "pointerup"].includes(state.event.type)
      )
        return;

      console.log(direction, distance, elapsedTime);
      if (!drawerIsOpen && direction[1] === -1) {
        drawerOpen();
      }
    },
    { axis: "y", pointer: { touch: true } },
  );

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
          <Flex borderRadius="0.8rem" flex="2" bgColor={bgColor} maxW="60%">
            <Box p="2rem" overflow="auto" w="100%">
              <TaskInfo />
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
            {...bind()}
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
