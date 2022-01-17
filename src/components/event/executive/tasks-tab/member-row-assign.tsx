import { Button, GridItem } from "@chakra-ui/react";
import { BaseMemberRow } from "@components/shared/member-row-base";
import { useMutation } from "@hooks/useMutation";
import { EventTask, User } from "@typings";
import { Return } from ".";

export const MemberAssignRow: React.FC<{
  user: User;
  task: Return;
  action: "assign" | "unassign";
  refetchUrl: string;
  onClose: () => void;
}> = ({ user, task, action, onClose, refetchUrl }) => {
  const mutate = useMutation<EventTask, { taskId: string; userId: string }>(
    `/tasks/${action}`,
    "patch",
    refetchUrl
  );

  return (
    <>
      <BaseMemberRow user={user} />
      <GridItem alignSelf="center">
        <Button
          onClick={async () => {
            await mutate({ userId: user.id, taskId: task.id });
            onClose();
          }}
        >
          {action[0].toLocaleUpperCase() + action.slice(1, action.length)}
        </Button>
      </GridItem>
    </>
  );
};
