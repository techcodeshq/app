import {
  Avatar,
  AvatarGroup,
  Box,
  Checkbox,
  Flex,
  GridItem,
  Input,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { EventTask, EventTaskOnUser, User } from "@typings";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { BsStack } from "react-icons/bs";
import { Return } from ".";
import { useTask } from "./context";

const MotionFlex = motion(Flex);

export const Task: React.FC<{
  task: EventTask & { assignees: (EventTaskOnUser & { user: User })[] } & {
    _count: { subTasks: number };
  };
  index: number;
  refetchUrl: string;
}> = ({ task, index, refetchUrl }) => {
  const toggler = useMutation<Return, { taskId: string; value: boolean }>(
    "/tasks/toggle",
    "patch",
    refetchUrl,
  );
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const itemBgColor = useColorModeValue("bg.200", "bg.700");
  const { updateHistory, taskUrl, setTaskUrl } = useTask();
  const router = useRouter();

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
        {task._count.subTasks > 0 && (
          <Box ml="1rem">
            <BsStack />
          </Box>
        )}
        <Stack
          spacing="0.5rem"
          onClick={() => {
            updateHistory();
            setTaskUrl(`/tasks/${task.id}`);
          }}
          display="flex"
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          flex="4"
          p="1.5rem"
          color={
            task.dueDate
              ? new Date().getTime() > new Date(task.dueDate).getTime() &&
                !task.completedAt
                ? "red.300"
                : task.completedAt
                ? "green.300"
                : null
              : null
          }
        >
          <Stack spacing="0" textDecor={task.completedAt && "line-through"}>
            <Text wordBreak="break-word" noOfLines={2}>
              {task.name}
            </Text>
            {task.dueDate && (
              <Text>Due On: {new Date(task.dueDate).toLocaleDateString()}</Text>
            )}
          </Stack>
          <AvatarGroup size="md" max={2}>
            {task.assignees.map(({ user }) => (
              <Avatar name={user.name} src={user.image} />
            ))}
          </AvatarGroup>
        </Stack>
        <Flex
          bgColor={itemBgColor}
          p="1.5rem"
          h="100%"
          onClick={() => {
            toggler({ taskId: task.id, value: !task.completedAt });
          }}
          borderRightRadius="0.8rem"
        >
          <Checkbox
            size="lg"
            isChecked={!!task.completedAt}
            onChange={() => {
              toggler({ taskId: task.id, value: !task.completedAt });
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          />
        </Flex>
      </Flex>
    </MotionFlex>
  );
};
