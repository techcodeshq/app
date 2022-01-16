import { Button, GridItem } from "@chakra-ui/react";
import { BaseMemberRow } from "@components/shared/member-row-base";
import { useMutation } from "@hooks/useMutation";
import { EventTask, User } from "@typings";

export const MemberAssignRow: React.FC<{
  user: User;
  task: EventTask;
  action: "assign" | "unassign";
  setSelectedTask: any;
  onClose: () => void;
}> = ({ user, task, action, onClose, setSelectedTask }) => {
  const mutate = useMutation<EventTask, { taskId: string; userId: string }>(
    `/tasks/${action}`,
    "patch"
  );

  return (
    <>
      <BaseMemberRow user={user} />
      <GridItem alignSelf="center">
        <Button
          onClick={async () => {
            const res = await mutate({ userId: user.id, taskId: task.id });
            setSelectedTask(res);
            onClose();
          }}
        >
          {action[0].toLocaleUpperCase() + action.slice(1, action.length)}
        </Button>
      </GridItem>
    </>
  );
};
