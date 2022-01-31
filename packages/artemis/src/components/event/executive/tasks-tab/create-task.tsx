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
import { EventTask } from "@prisma/client";
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

  const { event } = useEvent();
  const parentDueDate = task.isRoot
    ? new Date(event.date)
    : new Date(task.dueDate);

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
              dueDate: parentDueDate,
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
                task={task}
              />
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
