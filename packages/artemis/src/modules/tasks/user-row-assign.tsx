import { Button, Td, Tr } from "@chakra-ui/react";
import { BaseUserRow } from "@components/user-row-base";
import { useMutation } from "@hooks/useMutation";
import { EventTask, User } from "@prisma/client";
import { useState } from "react";
import { Return } from ".";

export const UserAssignRow: React.FC<{
  user: User;
  task: Return;
  assign: boolean;
  refetchUrl: string;
}> = ({ user, task, assign, refetchUrl }) => {
  const mutate = useMutation<
    EventTask,
    { taskId: string; userId: string; assign: boolean }
  >("/tasks/assign", "patch", refetchUrl);
  const [currentAssign, setCurrentAssign] = useState(assign);

  return (
    <Tr>
      <BaseUserRow user={user} />
      <Td>
        <Button
          onClick={async () => {
            await mutate({
              userId: user.id,
              taskId: task.id,
              assign: currentAssign,
            });
            setCurrentAssign(!currentAssign);
          }}
        >
          {currentAssign ? "Assign" : "Unassign"}
        </Button>
      </Td>
    </Tr>
  );
};
