import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
import { CreateTask } from "./create-task";
import { Task } from "./task";

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
  })[];
  assignees?:
    | (EventTaskOnUser & {
        user: User;
      })[]
    | undefined;
  isRoot: boolean;
};

export const EventsTab: React.FC<{ eventCreate: UseDisclosureReturn }> = ({
  eventCreate,
}) => {
  const router = useRouter();
  const { event } = useEvent();
  const [history, updateHistory] = useState<{
    data: { name: string; parent: string; child: string }[];
    idx: number;
  }>(
    router.query.history
      ? JSON.parse(router.query.history! as string)
      : {
          data: [
            {
              name: "Root",
              parent: `/events/tasks/${event.id}`,
              child: `/events/tasks/${event.id}`,
            },
          ],
          idx: 0,
        }
  );
  const [taskUrl, setTaskUrl] = useState(history.data[history.idx].child);
  const { data: task, mutate: revalidate } = useQuery<Return>(taskUrl);
  const deleteTask = useMutation(`/tasks/${task?.id}`, "delete", "", [task]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const itemBgColor = useColorModeValue("bg.200", "bg.700");

  useEffect(() => {
    const query = new URLSearchParams({
      ...router.query,
      history: JSON.stringify(history),
    });
    router.push({ query: query.toString() });
  }, [history]);

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
        {task && (
          <IconButton
            disabled={task.isRoot}
            onClick={() => {
              setTaskUrl(history.data[history.idx].parent);
              updateHistory((cur) => ({
                data: cur.data.filter(
                  (item) => item !== history.data[history.idx]
                ),
                idx: cur.idx - 1,
              }));
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
                }}
              >
                {h.name}
              </Button>
              <Divider orientation="vertical" />
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
      <Flex
        gap="2rem"
        h="100%"
        overflow="auto"
        flexDir={{ base: "column", md: "row" }}
      >
        <Flex flex="1" overflow="auto">
          <Flex flexDir="column" h="100%" w="100%">
            <AnimatePresence>
              {task?.subTasks?.length > 0 && task ? (
                <Stack spacing="1rem">
                  {task.subTasks.map((item, index) => (
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
                              child: `/tasks/${item.id}`,
                              parent: taskUrl,
                            },
                          ],
                          idx: cur.idx + 1,
                        }));
                        setTaskUrl(`/tasks/${item.id}`);
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                task?.subTasks?.length === 0 && (
                  <Center h="100%">
                    <Heading color="gray.600" textAlign="center">
                      This task has no sub tasks!
                    </Heading>
                  </Center>
                )
              )}
            </AnimatePresence>
          </Flex>
        </Flex>
        <Flex borderRadius="0.8rem" flex="2" bgColor={bgColor} h="100%">
          {task && !task.isRoot && (
            <Flex p="2rem">
              <Flex flex="1" overflow="auto">
                <Stack spacing="1rem" w="100%">
                  <Box>
                    <Flex alignItems="center" justifyContent="space-between">
                      <Heading fontWeight="500">{task.name}</Heading>
                      <IconButton
                        onClick={async () => {
                          await deleteTask({});
                          await revalidate();

                          setTaskUrl(history.data[history.idx - 1].child);
                          updateHistory((cur) => ({
                            data: cur.data.slice(0, -1),
                            idx: cur.idx - 1,
                          }));
                        }}
                        bgColor="red.300"
                        _hover={{ bgColor: "red.400" }}
                        aria-label="delete"
                        icon={<DeleteIcon color={bgColor} />}
                      />
                    </Flex>
                    <Text>
                      Due On: {new Date(task.dueDate).toLocaleDateString()}
                    </Text>
                    <Text>{task.description}</Text>
                  </Box>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Heading fontWeight="500">People</Heading>
                    <IconButton
                      icon={<EditIcon />}
                      aria-label="edit"
                      onClick={onOpen}
                    />
                  </Flex>
                  <Stack>
                    {task.assignees?.map(({ user }) => (
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
        task={task}
        isOpen={isOpen}
        onClose={onClose}
        refetchUrl={taskUrl}
        assignees={
          task?.assignees ? task?.assignees.map((item) => item.user.id) : []
        }
      />
      {task && (
        <CreateTask
          refetchUrl={taskUrl}
          isOpen={eventCreate.isOpen}
          onClose={eventCreate.onClose}
          route={task.isRoot ? "/tasks" : "/tasks/sub-task"}
          id={task.isRoot ? event.id : task.id}
        />
      )}
    </Flex>
  );
};
