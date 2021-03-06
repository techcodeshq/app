import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import { EventTask } from "@prisma/client";
import { Formik } from "formik";
import { TaskForm } from "./task-form";

type Body = {
  id: string;
  data: Partial<{
    name: string;
    description: string;
    dueDate: Date;
  }>;
};

export type Return = (EventTask & {
  Event: {
    name: string;
    slug: string;
  };
})[];

export const EditTask: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  task: EventTask;
  refetchUrl: string;
}> = ({ isOpen, onClose, task, refetchUrl }) => {
  const bgColor = useColorModeValue("bg.50", "bg.800");
  const borderBottom = useColorModeValue("bg.200", "black");
  const edit = useMutation<EventTask, Body>("/tasks", "patch", refetchUrl);
  const { data: parent } = useQuery<Return>(`/tasks/${task.eventTaskId}`);

  const generateDate = (current: Date) => {
    const date = new Date(current);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, -1);
  };

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
          Edit Task
          <ModalCloseButton position="relative" />
        </ModalHeader>
        <ModalBody p={{ base: "0", md: "0 15rem" }}>
          <Formik
            initialValues={{
              name: task.name,
              description: task.description,
              dueDate: task.dueDate ? new Date(task.dueDate) : null,
            }}
            onSubmit={async (values) => {
              await edit({
                id: task.id,
                data: {
                  ...values,
                  dueDate: values.dueDate ? new Date(values.dueDate) : null,
                },
              });

              onClose();
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <TaskForm
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                task={parent}
              />
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
