import {
  Box,
  Center,
  Divider,
  Flex,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import useOnScreen from "@hooks/useOnScreen";
import { useQueryInfinite } from "@hooks/useQueryInfinite";
import { useSocket } from "@hooks/useSocket";
import { ChatMessage, User } from "@typings";
import { useEffect, useRef, useState } from "react";
import { useTask } from "../context";
import { MessageGroups } from "./message-groups";
import { MessageInput } from "./message-input";
import { ScrollWarnings } from "./scroll-warnings";

export type Return = {
  groups: {
    user: {
      image: string | null;
      name: string | null;
      id: string;
    };
    createdAt: Date;
    messages: {
      page: number;
      id: string;
      content: string;
      authorId: string;
      eventTaskId: string;
      createdAt: Date;
      updatedAt: Date;
      author: {
        image: string | null;
        name: string | null;
        id: string;
      };
    }[];
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
      if (
        !data ||
        socket.hasListeners("message_published") ||
        socket.hasListeners("message_deleted")
      )
        return;

      console.log("REGISTERING :)");
      socket.on(
        "message_published",
        async (message: ChatMessage & { author: User }) => {
          setUpdateQueued(true);
        },
      );

      socket.on("message_deleted", async (page: number) => {
        await setSize(page + 1);
        mutate();
      });
    },
    [mutate, data],
  );

  return (
    <Flex h="100%" p="1rem 0" flexDir="column-reverse" gap="1rem">
      <Box>
        <ScrollWarnings
          size={size}
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
          {data && data[data.length - 1].hasMore && size > 1 ? (
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
        <MessageGroups
          data={data}
          messageBox={messageBox}
          lastMessage={lastMessage}
        />
      </Flex>
    </Flex>
  );
};
