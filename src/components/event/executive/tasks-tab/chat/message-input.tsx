import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { ChatMessage, EventTask } from "@typings";
import { Field, Form, Formik } from "formik";
import { MutableRefObject } from "react";

export const MessageInput: React.FC<{
  task: { id: string; name: string };
  visible: boolean;
  messageBox: MutableRefObject<HTMLDivElement>;
}> = ({ task, visible, messageBox }) => {
  const sendMessage = useMutation<
    ChatMessage,
    { content: string; taskId: string }
  >("/chat", "post");
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
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
                  borderRightRadius={{ base: 0, md: null }}
                  borderTopRadius={!visible ? 0 : null}
                  variant="filled"
                  placeholder={`Message ${task.name}`}
                />
              )}
            </Field>
            {isMobile && (
              <IconButton
                aria-label="send"
                icon={<ChevronRightIcon />}
                type="submit"
                borderTopRadius={!visible ? 0 : null}
                borderLeftRadius={0}
                isLoading={isSubmitting}
              />
            )}
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
