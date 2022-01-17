import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useColorModeValue,
  Button,
  FormControl,
  Input,
  ModalFooter,
  Stack,
  Textarea,
  FormLabel,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { EventTask } from "@typings";
import { Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { useEvent } from "../context";

type Body = {
  baseId: string;
  name: string;
  description: string;
  dueDate: Date;
};

export const CreateTask: React.FC<{
  route: string;
  isOpen: boolean;
  onClose: () => void;
  id: string;
  refetchUrl: string;
}> = ({ route, isOpen, onClose, id, refetchUrl }) => {
  const bgColor = useColorModeValue("bg.50", "bg.800");
  const borderBottom = useColorModeValue("bg.200", "black");
  const create = useMutation<EventTask, Body>(route, "post", refetchUrl, [
    route,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent bgColor={bgColor}>
        <ModalHeader
          fontSize="1.8rem"
          fontWeight="600"
          borderBottom="2px solid"
          borderBottomColor={borderBottom}
          display="flex"
          justifyContent="space-between"
          mb="2rem"
        >
          Create Task
          <ModalCloseButton position="relative" />
        </ModalHeader>
        <ModalBody p={{ base: "0", md: "0 15rem" }}>
          <Formik
            initialValues={{
              name: "",
              description: "",
              dueDate: new Date(),
            }}
            onSubmit={async (values) => {
              await create({ ...values, baseId: id });

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
                          <FormLabel>Task Name</FormLabel>
                          <Input
                            {...field}
                            id="name"
                            placeholder="Contact Sponsors..."
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
                          <Textarea
                            {...field}
                            size="lg"
                            id="description"
                            placeholder="Make sure to let them we're great!"
                            variant="filled"
                            autoComplete="off"
                          />
                        </FormControl>
                      )}
                    </Field>
                    <Field name="dueDate">
                      {({ field }) => (
                        <FormControl isRequired>
                          <FormLabel>Due Date</FormLabel>
                          <Input
                            {...field}
                            type="date"
                            id="dueDate"
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
