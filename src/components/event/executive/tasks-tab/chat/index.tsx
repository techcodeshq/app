import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Text,
  Flex,
  Input,
  Stack,
  HStack,
  Button,
  Box,
  Textarea,
  Center,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import useOnScreen from "@hooks/useOnScreen";
import { useQuery } from "@hooks/useQuery";
import { useQueryInfinite } from "@hooks/useQueryInfinite";
import { useSocket } from "@hooks/useSocket";
import { ChatMessage, User } from "@typings";
import { Field, Form, Formik } from "formik";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSWRConfig } from "swr";
import { useTask } from "../context";

type Return = {
  groups: {
    user: User;
    createdAt: Date;
    messages: (ChatMessage & {
      author: User;
    })[];
  }[];
  hasMore: boolean;
};

export const Chat = () => {
  const { task } = useTask();
  const { data, size, setSize, mutate } = useQueryInfinite<Return>(
    `/chat/${task.id}?page=`,
    {
      revalidateFirstPage: false,
    },
  );
  const sendMessage = useMutation<
    ChatMessage,
    { content: string; taskId: string }
  >("/chat", "post");
  const messageBox = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket>(null);
  const [updatedQueued, setUpdateQueued] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const [visible, setVisible] = useState(false);

  const lastBookElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        setVisible(entries[0].isIntersecting);
      });
      if (node) observer.current.observe(node);
    },
    [setSize, updatedQueued],
  );

  useEffect(() => {
    if (updatedQueued && visible) {
      if (size === 1) {
        mutate();
        return setUpdateQueued(false);
      }

      setSize(1).then(() => mutate());
      setUpdateQueued(false);
    }
  }, [updatedQueued, visible]);

  useEffect(() => {
    if ((data && !data[data.length - 1].hasMore) || size === 1) return;
    messageBox.current.children[1]?.scrollIntoView();
  }, [size]);

  useEffect(() => {
    if (data && data.length > 1) return;
    messageBox.current.lastElementChild?.scrollIntoView();
  }, [data]);

  useSocket(
    "/chat",
    (socket) => socket.emit("join_room", task.id),
    (socket) => {
      socket.on(
        "message_published",
        async (message: ChatMessage & { author: User }) => {
          setUpdateQueued(true);
        },
      );
    },
    [mutate, data],
  );

  return (
    <Flex h="100%" p="1rem 0" flexDir="column-reverse" gap="1rem">
      <Box>
        {!visible && updatedQueued && (
          <Flex
            bgColor="red.400"
            p="0.5rem"
            color="text.900"
            fontWeight="500"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="0.5rem"
            borderBottomRadius={0}
            _hover={{ cursor: "pointer" }}
            onClick={() =>
              messageBox.current?.lastElementChild?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            <Text>You have unread messages!</Text>
            <Flex alignItems="center">
              <Text mr="0.5rem">View</Text>
              <ChevronDownIcon />
            </Flex>
          </Flex>
        )}
        {!visible && !updatedQueued && (
          <Flex
            bgColor="gray.800"
            p="0.5rem"
            fontWeight="500"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="0.5rem"
            borderBottomRadius={0}
            _hover={{ cursor: "pointer" }}
            onClick={() =>
              messageBox.current?.lastElementChild?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            <Text>Viewing old messages</Text>
            <Flex alignItems="center">
              <Text mr="0.5rem">Jump to present</Text>
              <ChevronDownIcon />
            </Flex>
          </Flex>
        )}
        <Formik
          initialValues={{ content: "" }}
          onSubmit={async (values, { setFieldValue }) => {
            await sendMessage({ ...values, taskId: task.id });
            setFieldValue("content", "");

            messageBox.current.lastElementChild?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Flex>
                <Field name="content">
                  {({ field }) => (
                    <Input
                      {...field}
                      autoComplete="off"
                      borderRightRadius={0}
                      borderTopRadius={!visible ? 0 : null}
                      variant="filled"
                      placeholder={`Message ${task.name}`}
                    />
                  )}
                </Field>
                <Button
                  type="submit"
                  borderTopRadius={!visible ? 0 : null}
                  borderLeftRadius={0}
                  isLoading={isSubmitting}
                >
                  Send
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
      <Flex
        flexDir="column"
        gap="1rem"
        overflow="auto"
        ref={messageBox}
        onScroll={(e: React.UIEvent<HTMLElement>) => {
          if (
            e.currentTarget.scrollTop === 0 &&
            data[data.length - 1].hasMore
          ) {
            setSize(size + 1);
          }
        }}
      >
        {data && (
          <Flex flexDir="column" ref={messageBox}>
            {data
              .slice()
              .reverse()
              .map((result, dataIndex) =>
                result.groups.map((group, groupIndex) => (
                  <Flex mt="1rem">
                    <Avatar src={group.user.image} w="2.5rem" h="2.5rem" />
                    <Stack spacing="0" ml="0.5rem">
                      <HStack>
                        <Text fontWeight="600" fontSize="1.1rem">
                          {group.user.name}
                        </Text>
                        <Text
                          fontWeight="300"
                          color="gray.500"
                          fontSize="0.8rem"
                          whiteSpace="pre-line"
                        >
                          {moment(group.createdAt).calendar()}
                        </Text>
                      </HStack>
                      <Flex flexDir="column">
                        {group.messages
                          .slice()
                          .reverse()
                          .map((message, messageIndex) => (
                            <Text
                              ref={
                                dataIndex === data.length - 1 &&
                                groupIndex === result.groups.length - 1 &&
                                messageIndex === group.messages.length - 1
                                  ? lastBookElementRef
                                  : null
                              }
                            >
                              {message.content}
                            </Text>
                          ))}
                      </Flex>
                    </Stack>
                  </Flex>
                )),
              )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
