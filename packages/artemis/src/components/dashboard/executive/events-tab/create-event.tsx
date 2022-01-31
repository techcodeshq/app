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
import { useMutation } from "@hooks/useMutation";
import { Event } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import React from "react";

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEvent: React.FC<CreateEventProps> = ({
  isOpen,
  onClose,
}) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const create = useMutation<Event, Partial<Event>>(
    "/events",
    "post",
    "/events",
  );

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
            date: new Date(),
          }}
          onSubmit={async (values) => {
            await create(values);
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalBody>
                <Stack spacing={4}>
                  <Field name="name">
                    {({ field }) => (
                      <FormControl isRequired>
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
                      <FormControl isRequired>
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
                      <FormControl isRequired>
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
