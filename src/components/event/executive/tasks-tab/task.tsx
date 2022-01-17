import {
  Avatar,
  AvatarGroup,
  Checkbox,
  Flex,
  GridItem,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { EventTask, EventTaskOnUser, User } from "@typings";
import { motion } from "framer-motion";
import { Return } from ".";
import { useTask } from "./context";

const MotionFlex = motion(Flex);

export const Task: React.FC<{
  task: EventTask & { assignees: (EventTaskOnUser & { user: User })[] };
  index: number;
  refetchUrl: string;
}> = ({ task, index, refetchUrl }) => {
  const toggle = useMutation<Return, { taskId: string; value: boolean }>(
    "/tasks/toggle",
    "patch",
    refetchUrl
  );
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const itemBgColor = useColorModeValue("bg.200", "bg.700");
  const { updateHistory, taskUrl, setTaskUrl } = useTask();

  return (
    <MotionFlex
      initial={{ opacity: "0%" }}
      animate={{ opacity: "100%" }}
      exit={{ opacity: "0%" }}
      bgColor={bgColor}
      borderRadius="0.8rem"
      _hover={{ cursor: "pointer" }}
      whileHover={{ scale: "101%" }}
      transition={{
        type: "spring",
        duration: 0.2 * (index + 1),
      }}
    >
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Stack
          spacing="0.5rem"
          onClick={() => {
            updateHistory((cur) => ({
              data: [
                ...cur.data,
                {
                  name: task.name,
                  child: `/tasks/${task.id}`,
                  parent: taskUrl,
                },
              ],
              idx: cur.idx + 1,
            }));
            setTaskUrl(`/tasks/${task.id}`);
          }}
          display="flex"
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          flex="4"
          p="1.5rem"
          color={
            new Date().getTime() > new Date(task.dueDate).getTime() &&
            !task.completedAt
              ? "red.300"
              : task.completedAt
              ? "green.300"
              : null
          }
        >
          <Stack spacing="0" textDecor={task.completedAt && "line-through"}>
            <Text>{task.name}</Text>
            <Text>Due On: {new Date(task.dueDate).toLocaleString()}</Text>
          </Stack>
          <AvatarGroup size="md" max={2}>
            {task.assignees.map(({ user }) => (
              <Avatar name={user.name} src={user.image} />
            ))}
          </AvatarGroup>
        </Stack>
        <Flex bgColor={itemBgColor} p="1.5rem" h="100%">
          <Checkbox
            size="lg"
            isChecked={!!task.completedAt}
            onClick={(event) => {
              event.stopPropagation();
            }}
            onChange={(event) => {
              toggle({ taskId: task.id, value: !task.completedAt });
            }}
          />
        </Flex>
      </Flex>
    </MotionFlex>
  );
};
