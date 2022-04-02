import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useIsMobile } from "@hooks/useIsMobile";
import { useMutation } from "@hooks/useMutation";
import { Event } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEvent } from "./pages/context";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteItem } from "@components/delete-item";
import { MarkdownEditor } from "@components/markdown";

export const EventInfoSettings = () => {
  const isMobile = useIsMobile();
  const largeScreen = useBreakpointValue({ base: true, lg: false });
  const { event } = useEvent();
  const router = useRouter();
  const save = useMutation<Event, { eventId: string; data: Partial<Event> }>(
    "/events",
    "patch",
    `/event/${event.slug}`,
  );

  return (
    <Flex flexDir="column" gap="1rem" h="90vh">
      <Flex flexDir="column" flex="1" gap="1rem">
        <Flex alignItems="center" justifyContent="space-between">
          <Box>
            <Heading fontWeight="medium" fontSize="1.5rem">
              Event Overview
            </Heading>
            {!largeScreen && <Text opacity="50%">Edit event information</Text>}
          </Box>
        </Flex>
        <Divider />
      </Flex>
      <Flex
        h="100%"
        w="100%"
        overflow={{ base: null, md: "auto" }}
        gap={isMobile ? null : "1rem"}
        flexDir={largeScreen ? "column" : "row"}
      >
        <Box w="100%">
          <Formik
            initialValues={{
              name: event.name,
              description: event.description,
              date: new Date(event.date),
            }}
            enableReinitialize={true}
            onSubmit={async ({ name, description, date }) => {
              const payload = {
                description,
                date,
              };

              if (name !== event.name) {
                payload["name"] = name;
              }

              const data = await save({
                eventId: event.id,
                data: payload,
              });

              if (data.slug !== event.slug) {
                router.push(`/event/${data.slug}/tasks`);
              }
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <Stack spacing={8}>
                  <Field name="name">
                    {({ field }) => (
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                          {...field}
                          id="name"
                          variant="filled"
                          autoComplete="off"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field }) => (
                      <FormControl isRequired>
                        <FormLabel>Task Description</FormLabel>
                        <MarkdownEditor
                          value={field.value}
                          onChange={(val) => setFieldValue(field.name, val)}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="date">
                    {({ field }) => (
                      <FormControl>
                        <FormLabel>Date</FormLabel>
                        <Input
                          {...field}
                          as={DatePicker}
                          id="dueDate"
                          variant="filled"
                          autoComplete="off"
                          name="dueDate"
                          selected={
                            (field.value && new Date(field.value)) || null
                          }
                          onChange={(val) => {
                            setFieldValue(field.name, val);
                          }}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Flex justifyContent="space-between">
                    <Button type="submit" isLoading={isSubmitting}>
                      Save
                    </Button>
                    <DeleteItem
                      url={`/events/${event.id}`}
                      itemName={event.name}
                      warningText="Are you sure you want to delete this event?"
                      refetchUrl=""
                      postDelete={async () => {
                        router.push("/dashboard");
                      }}
                      deps={[event]}
                    >
                      {(onOpen) => (
                        <Button
                          bgColor="red.500"
                          onClick={onOpen}
                          label={`Delete ${event.name}`}
                          _hover={{ bgColor: "red.600" }}
                          placement="bottom"
                        >
                          Delete
                        </Button>
                      )}
                    </DeleteItem>
                  </Flex>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Flex>
  );
};
