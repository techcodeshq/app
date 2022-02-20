import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteItem } from "@components/shared/delete-item";
import { MarkdownPreview } from "@components/shared/markdown";
import { TooltipButton } from "src/ui/tooltip-button";
import { useMutation } from "@hooks/useMutation";
import { EventTask } from "@prisma/client";
import { BsFillPersonPlusFill } from "react-icons/bs";
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
  const itemBgColor = useColorModeValue("bg.200", "bg.600");
  const iconColor = useColorModeValue("bg.100", "bg.800");

  const toggler = useMutation<Return, { taskId: string; value: boolean }>(
    "/tasks/toggle",
    "patch",
    taskUrl,
  );

  return (
    <>
      <Stack spacing="1rem">
        <Heading fontWeight="regular" wordBreak="break-word" noOfLines={2}>
          {task.name}
        </Heading>
        <Flex alignItems="center" justifyContent="space-between" gap="0.5rem">
          {task.dueDate && (
            <Button
              _hover={{ cursor: "auto" }}
              fontWeight="regular"
              p="0.6rem"
              bgColor={itemBgColor}
              w="12rem"
              borderRadius="0.5rem"
            >
              <Text>
                <Box as="span" color="text.300" mr="0.5rem">
                  Due On:
                </Box>
                {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </Button>
          )}
          <Flex gap="0.5rem">
            <TooltipButton
              bgColor={itemBgColor}
              label="Edit Assignees"
              icon={<BsFillPersonPlusFill />}
              onClick={onOpen}
            />
            <TooltipButton
              bgColor={itemBgColor}
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
              bgColor={itemBgColor}
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
            >
              {(onOpen) => (
                <TooltipButton
                  bgColor={itemBgColor}
                  onClick={onOpen}
                  label={`Delete ${task.name}`}
                  _hover={{ bgColor: "red.400" }}
                  icon={<DeleteIcon />}
                  placement="bottom"
                />
              )}
            </DeleteItem>
          </Flex>
        </Flex>
        <MarkdownPreview content={task.description} />
        <Divider />
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
          gap="1rem"
        >
          {task.assignees?.map(({ user }) => (
            <GridItem>
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
            </GridItem>
          ))}
        </Grid>
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
