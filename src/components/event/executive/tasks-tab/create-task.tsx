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
import { TaskForm } from "./task-form";

type Body = {
  baseId: string;
  name: string;
  description: string;
  dueDate: Date;
};

const generateDate = (current: Date, showSeconds = false) => {
  const date = new Date(current);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, showSeconds ? -8 : -1);
};

export const CreateTask: React.FC<{
  route: string;
  isOpen: boolean;
  onClose: () => void;
  id: string;
  refetchUrl: string;
  task: any;
}> = ({ route, isOpen, onClose, id, refetchUrl, task }) => {
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
              dueDate: task.dueDate ? generateDate(task.dueDate) : null,
            }}
            onSubmit={async (values) => {
              await create({
                ...values,
                baseId: id,
                dueDate: values.dueDate ? new Date(values.dueDate) : null,
              });

              onClose();
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <TaskForm
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
              />
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
