import { Button, GridItem } from "@chakra-ui/react";
import { BaseMemberRow } from "@components/shared/member-row-base";
import { useMutation } from "@hooks/useMutation";
import { EventTask, User } from "@typings";
import { useState } from "react";
import { Return } from ".";

export const MemberAssignRow: React.FC<{
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
    <>
      <BaseMemberRow user={user} />
      <GridItem alignSelf="center">
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
      </GridItem>
    </>
  );
};
