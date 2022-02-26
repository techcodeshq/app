import { EventTasks } from "src/modules/tasks";
import { EventLayout } from "./layout";
import { Event, Perm } from "@prisma/client";
import { History } from "src/types/history";
import { TaskProvider } from "src/modules/tasks/context";
import { TabHeading } from "@ui/tab-heading";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";

export const EventTasksView: React.FC<{
  event: Event;
  history: History;
}> = ({ event, history }) => {
  const taskCreate = useDisclosure();

  return (
    <EventLayout event={event}>
      <TabHeading heading={`${event.name} - Tasks`}>
        <RenderIfAllowed perms={[Perm.MANAGE_EVENT_TASK]}>
          <Button onClick={taskCreate.onOpen}>Create</Button>
        </RenderIfAllowed>
      </TabHeading>
      <Box overflowY="auto" overflowX="hidden" h="100%" mt="1rem">
        <TaskProvider history={history}>
          <EventTasks taskCreate={taskCreate} />
        </TaskProvider>
      </Box>
    </EventLayout>
  );
};
