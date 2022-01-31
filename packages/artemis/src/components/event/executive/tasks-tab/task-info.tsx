import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteItem } from "@components/shared/delete-item";
import { MarkdownPreview } from "@components/shared/markdown";
import { TooltipButton } from "@components/ui/tooltip-button";
import { useMutation } from "@hooks/useMutation";
import { EventTask } from "@prisma/client";
import {
  ImCheckboxChecked as Checked,
  ImCheckboxUnchecked as Unchecked,
} from "react-icons/im";
import { Return } from ".";
import { AssignUser } from "./assign-user";
import { useTask } from "./context";
import { EditTask } from "./edit-task";

export const TaskInfo: React.FC = () => {
  const { history, updateHistory, setTaskUrl, task, taskUrl, revalidate } =
    useTask();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();
  const itemBgColor = useColorModeValue("bg.200", "bg.700");
  const iconColor = useColorModeValue("bg.100", "bg.800");

  const toggler = useMutation<Return, { taskId: string; value: boolean }>(
    "/tasks/toggle",
    "patch",
    taskUrl,
  );

  return (
    <>
      <Stack spacing="1rem">
        <Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading fontWeight="500" wordBreak="break-word" noOfLines={2}>
              {task.name}
            </Heading>
            <Flex gap="1rem">
              <TooltipButton
                icon={task.completedAt ? <Checked /> : <Unchecked />}
                label={task.completedAt ? "Unfinish" : "Finish"}
                onClick={() =>
                  toggler({
                    taskId: task.id,
                    value: !task.completedAt,
                  })
                }
              />
              <TooltipButton
                icon={<EditIcon />}
                label="Edit"
                onClick={editOnOpen}
              />

              <DeleteItem
                url={`/tasks/${task?.id}`}
                itemName={task.name}
                warningText="Are you sure you want to delete this task?"
                postDelete={async () => {
                  await revalidate();

                  setTaskUrl(history.data[history.idx - 1].child);
                  updateHistory();
                }}
                refetchUrl=""
                deps={[task]}
                iconColor={iconColor}
              />
            </Flex>
          </Flex>
          {task.dueDate && (
            <Text>Due On: {new Date(task.dueDate).toLocaleDateString()}</Text>
          )}
        </Box>
        <MarkdownPreview content={task.description} />
        <Flex alignItems="center" justifyContent="space-between">
          <Heading fontWeight="500">People</Heading>
          <IconButton icon={<EditIcon />} aria-label="edit" onClick={onOpen} />
        </Flex>
        <Stack>
          {task.assignees?.map(({ user }) => (
            <Flex
              alignItems="center"
              justifyContent="space-between"
              p="1rem"
              bgColor={itemBgColor}
              key={user.id}
              borderRadius="0.8rem"
            >
              <Text>{user.name}</Text>
              <Avatar src={user.image} />
            </Flex>
          ))}
        </Stack>
      </Stack>
      <EditTask
        isOpen={editIsOpen}
        onClose={editOnClose}
        refetchUrl={taskUrl}
        task={task as unknown as EventTask}
      />
      <AssignUser
        task={task}
        isOpen={isOpen}
        onClose={onClose}
        refetchUrl={taskUrl}
        assignees={
          task?.assignees ? task?.assignees.map((item) => item.user.id) : []
        }
      />
    </>
  );
};
