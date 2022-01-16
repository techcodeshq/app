import {
  Checkbox,
  Flex,
  GridItem,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { EventTask } from "@typings";
import { motion } from "framer-motion";
import { Return } from ".";

const MotionFlex = motion(Flex);

export const Task: React.FC<{
  task: Return;
  index: number;
  onClick: () => void;
  refetchUrl: string;
}> = ({ task, index, onClick, refetchUrl }) => {
  const toggle = useMutation<Return, { taskId: string; value: boolean }>(
    "/tasks/toggle",
    "patch",
    refetchUrl
  );

  return (
    <MotionFlex
      // initial={{ scale: "0%" }}
      // animate={{ scale: "100%" }}
      // exit={{ opacity: 0 }}
      bgColor="bg.800"
      // m="1rem 0 0.5rem"
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
          onClick={onClick}
          display="flex"
          flex="4"
          p="1.5rem"
        >
          <Text>{task.name}</Text>
          <Text>{new Date(task.dueDate).toLocaleDateString()}</Text>
        </Stack>
        <Flex bgColor="bg.700" p="1.5rem" h="100%">
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
