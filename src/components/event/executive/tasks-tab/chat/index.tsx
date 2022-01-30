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
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import useOnScreen from "@hooks/useOnScreen";
import { useQuery } from "@hooks/useQuery";
import { useQueryInfinite } from "@hooks/useQueryInfinite";
import { useSocket } from "@hooks/useSocket";
import { ChatMessage, EventTask, User } from "@typings";
import { Field, Form, Formik } from "formik";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSWRConfig } from "swr";
import { useTask } from "../context";
import { MessageInput } from "./message-input";
import { ScrollWarnings } from "./scroll-warnings";

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
  const messageBox = useRef<HTMLDivElement>(null);
  const [updateQueued, setUpdateQueued] = useState(false);
  const { ref: lastMessage, visible } = useOnScreen();

  useEffect(() => {
    if (updateQueued && visible) {
      if (size === 1) {
        mutate();
        return setUpdateQueued(false);
      }

      setSize(1).then(() => mutate());
      setUpdateQueued(false);
    }
  }, [updateQueued, visible]);

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
        <ScrollWarnings
          visible={visible}
          updateQueued={updateQueued}
          messageBox={messageBox}
        />
        <MessageInput
          task={{ id: task.id, name: task.name }}
          messageBox={messageBox}
          visible={visible}
        />
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
        <Center>
          {data && data[data.length - 1].hasMore ? (
            <Spinner />
          ) : (
            <Stack w="100%">
              <Center>
                <Text color="gray.600">Welcome to the Dawn of Time!</Text>
              </Center>
              <Divider />
            </Stack>
          )}
        </Center>
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
                                  ? lastMessage
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
