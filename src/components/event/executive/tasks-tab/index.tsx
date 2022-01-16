import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { EventTask, EventTaskOnUser, User } from "@typings";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BsChevronUp } from "react-icons/bs";
import { useEvent } from "../context";
import { AssignUser } from "./assign-user";
import { CreateTask } from "./create-task";
import { Task } from "./task";

const MotionButton = motion(Button);

export type Return = EventTask & {
  assignees: (EventTaskOnUser & {
    user: User;
  })[];
  subTasks: EventTask[];
};

export const EventsTab: React.FC<{ eventCreate: UseDisclosureReturn }> = ({
  eventCreate,
}) => {
  const { event } = useEvent();
  const [taskUrl, setTaskUrl] = useState(`/events/tasks/${event.id}`);
  const { data: tasks } = useQuery<Return[]>(taskUrl);
  const [history, updateHistory] = useState<{
    data: { name: string; parent: string; child: string; task: Return }[];
    idx: number;
  }>({
    data: [
      {
        name: "Root",
        task: null,
        parent: `/events/tasks/${event.id}`,
        child: `/events/tasks/${event.id}`,
      },
    ],
    idx: 0,
  });
  const [selectedTask, setSelectedTask] = useState<Return>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const itemBgColor = useColorModeValue("bg.200", "bg.700");

  useEffect(() => {
    if (history.data.length === 1) setSelectedTask(null);
  }, [history]);

  useEffect(() => {
    updateHistory((cur) => {
      const copy = [...history.data];
      copy[history.idx].task = selectedTask;

      return {
        data: copy,
        idx: cur.idx,
      };
    });
  }, [selectedTask]);

  return (
    <Flex
      gap="2rem"
      h="100%"
      width={{ base: null, md: "100%" }}
      flexDir="column"
    >
      <Flex
        bgColor={bgColor}
        p="0.5rem"
        borderRadius="0.8rem"
        sx={{
          "&::-webkit-scrollbar": { height: "0.5rem" },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.700",
            borderRadius: "0.4rem",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "gray.700",
        }}
      >
        {tasks && (
          <IconButton
            disabled={selectedTask === null}
            onClick={() => {
              setTaskUrl(history.data[history.idx].parent);
              updateHistory((cur) => ({
                data: cur.data.filter(
                  (item) => item !== history.data[history.idx]
                ),
                idx: cur.idx - 1,
              }));
              setSelectedTask(history[history.idx - 1]?.task);
            }}
            variant="ghost"
            icon={<BsChevronUp />}
            aria-label="up-level"
          />
        )}
        <Flex>
          {history.data.map((h, index) => (
            <React.Fragment key={index}>
              <Button
                variant={index === history.idx ? "solid" : "ghost"}
                onClick={() => {
                  if (index === history.idx) return;

                  setTaskUrl(h.child);
                  updateHistory((cur) => ({
                    data: cur.data.splice(0, index + 1),
                    idx: index,
                  }));
                  setSelectedTask(history.data[index].task);
                }}
              >
                {h.name}
              </Button>
              <Divider orientation="vertical" />
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
      <Flex gap="2rem" h="100%" overflow="auto">
        <Flex flex="1" overflow="auto">
          <Flex flexDir="column" h="100%" w="100%">
            <AnimatePresence>
              {tasks?.length > 0 && tasks ? (
                <Stack spacing="1rem">
                  {tasks.map((item, index) => (
                    <Task
                      key={item.id}
                      task={item}
                      index={index}
                      refetchUrl={taskUrl}
                      onClick={() => {
                        updateHistory((cur) => ({
                          data: [
                            ...cur.data,
                            {
                              name: item.name,
                              task: item,
                              child: `/tasks/${item.id}`,
                              parent: taskUrl,
                            },
                          ],
                          idx: cur.idx + 1,
                        }));
                        setTaskUrl(`/tasks/${item.id}`);
                        setSelectedTask(item);
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                tasks?.length === 0 && (
                  <Center h="100%">
                    <Heading color="gray.600">
                      This task has no sub tasks!
                    </Heading>
                  </Center>
                )
              )}
            </AnimatePresence>
          </Flex>
        </Flex>
        <Flex borderRadius="0.8rem" flex="2" bgColor={bgColor} h="100%">
          {selectedTask && (
            <Flex p="2rem">
              <Flex flex="1" overflow="auto">
                <Stack spacing="1rem" w="100%">
                  <Box>
                    <Heading>{selectedTask.name}</Heading>
                    <Text>
                      {new Date(selectedTask.dueDate).toLocaleString()}
                    </Text>
                    <Text>{selectedTask.description}</Text>
                  </Box>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Heading as="h2">People</Heading>
                    <IconButton
                      icon={<EditIcon />}
                      aria-label="edit"
                      onClick={onOpen}
                    />
                  </Flex>
                  <Stack>
                    {selectedTask.assignees?.map(({ user }) => (
                      <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        p="1rem"
                        bgColor={itemBgColor}
                        key={user.id}
                        borderRadius="0.8rem"
                      >
                        <Text>{user.name}</Text>
                        <Avatar src={user.image} />
                      </Flex>
                    ))}
                  </Stack>
                </Stack>
              </Flex>
              <Flex flex="1">
                <Center width="100%">
                  <Heading color="gray.600" textAlign="center">
                    Chat Coming Soon to a TechCodes app near you!
                  </Heading>
                </Center>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
      <AssignUser
        task={selectedTask}
        isOpen={isOpen}
        onClose={onClose}
        setSelectedTask={setSelectedTask}
        assignees={
          selectedTask?.assignees
            ? selectedTask?.assignees.map((item) => item.user.id)
            : []
        }
      />
      <CreateTask
        refetchUrl={taskUrl}
        isOpen={eventCreate.isOpen}
        onClose={eventCreate.onClose}
        route={!selectedTask ? "/tasks" : "/tasks/sub-task"}
        id={!selectedTask ? event.id : selectedTask.id}
      />
    </Flex>
  );
};
