import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAxios } from "@lib/axios";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useSWRConfig } from "swr";

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEvent: React.FC<CreateEventProps> = ({
  isOpen,
  onClose,
}) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const { axios } = useAxios();
  const { mutate } = useSWRConfig();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor={bgColor}>
        <ModalHeader>Create Event</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            name: "",
            description: "",
            date: "",
          }}
          onSubmit={async (values) => {
            const res = await axios.post("/events", values);
            mutate("/events");
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalBody>
                <Stack spacing={4}>
                  <Field name="name">
                    {({ field }) => (
                      <FormControl>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Event Name"
                          variant="filled"
                          autoComplete="off"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field }) => (
                      <FormControl>
                        <Input
                          {...field}
                          id="description"
                          placeholder="Event Description"
                          variant="filled"
                          autoComplete="off"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="date">
                    {({ field }) => (
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          id="date"
                          variant="filled"
                        />
                      </FormControl>
                    )}
                  </Field>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button width="30%" type="submit" isLoading={isSubmitting}>
                  Create
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
