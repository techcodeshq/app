import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import {
  Stack,
  Box,
  Flex,
  Heading,
  IconButton,
  Avatar,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { AssignUser } from "./assign-user";
import { useTask } from "./context";

export const TaskInfo: React.FC = () => {
  const { history, updateHistory, setTaskUrl, task, taskUrl, revalidate } =
    useTask();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const itemBgColor = useColorModeValue("bg.200", "bg.700");
  const deleteTask = useMutation(`/tasks/${task?.id}`, "delete", "", [task]);

  return (
    <>
      <Stack spacing="1rem">
        <Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading fontWeight="500">{task.name}</Heading>
            <IconButton
              onClick={async () => {
                await deleteTask({});
                await revalidate();

                setTaskUrl(history.data[history.idx - 1].child);
                updateHistory((cur) => ({
                  data: cur.data.slice(0, -1),
                  idx: cur.idx - 1,
                }));
              }}
              bgColor="red.300"
              _hover={{ bgColor: "red.400" }}
              aria-label="delete"
              icon={<DeleteIcon color={bgColor} />}
            />
          </Flex>
          <Text>Due On: {new Date(task.dueDate).toLocaleDateString()}</Text>
          <Text>{task.description}</Text>
        </Box>
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
