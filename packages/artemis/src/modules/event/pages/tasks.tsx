import { EventTasks } from "src/modules/tasks";
import { EventLayout } from "./layout";
import { Event } from "@prisma/client";
import { History } from "src/types/history";
import { TaskProvider } from "src/modules/tasks/context";
import { TabHeading } from "@ui/tab-heading";
import { Box, Button, useDisclosure } from "@chakra-ui/react";

export const EventTasksView: React.FC<{
  event: Event;
  history: History;
}> = ({ event, history }) => {
  const taskCreate = useDisclosure();

  return (
    <EventLayout event={event}>
      <TabHeading heading={`${event.name} - Tasks`}>
        <Button onClick={taskCreate.onOpen}>Create</Button>
      </TabHeading>
      <Box mt="1rem" h="100%">
        <TaskProvider history={history}>
          <EventTasks taskCreate={taskCreate} />
        </TaskProvider>
      </Box>
    </EventLayout>
  );
};