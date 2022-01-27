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
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import { ChatMessage, User } from "@typings";
import { Field, Form, Formik } from "formik";
import moment from "moment";
import { useTask } from "../context";

type MessagesWithAuthor = (ChatMessage & {
  author: User;
})[];

const group = (data: MessagesWithAuthor) => {
  let currentUser;
  let currentDate;
  const grouped = [];

  for (const message of data) {
    if (
      message.authorId !== currentUser ||
      new Date(message.createdAt).getMinutes() !==
        new Date(currentDate).getMinutes()
    ) {
      grouped.push({
        user: message.author,
        createdAt: message.createdAt,
        messages: [message],
      });
      currentUser = message.authorId;
      currentDate = message.createdAt;

      continue;
    }

    grouped[grouped.length - 1].messages.push(message);
  }

  return grouped;
};

export const Chat = () => {
  const { task } = useTask();
  const { data: messages } = useQuery<MessagesWithAuthor>(`/chat/${task.id}`);
  const sendMessage = useMutation<
    ChatMessage,
    { content: string; taskId: string }
  >("/chat", "post", `/chat/${task.id}`);

  return (
    <Flex h="100%" p="1rem 0" flexDir="column-reverse" gap="1rem">
      <Formik
        initialValues={{ content: "" }}
        onSubmit={async (values, { setFieldValue }) => {
          await sendMessage({ ...values, taskId: task.id });
          setFieldValue("content", "");
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
                    variant="filled"
                    placeholder={`Message ${task.name}`}
                  />
                )}
              </Field>
              <Button
                type="submit"
                borderLeftRadius={0}
                isLoading={isSubmitting}
              >
                Send
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
      <Flex flexDir="column-reverse" gap="1rem" overflow="auto">
        {messages &&
          group(messages).map((group) => (
            <Flex>
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
                <Flex flexDir="column-reverse">
                  {group.messages.map((message) => (
                    <Text>{message.content}</Text>
                  ))}
                </Flex>
              </Stack>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};
