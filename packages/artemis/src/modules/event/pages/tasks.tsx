import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { Perm } from "@prisma/client";
import { TabHeading } from "@ui/tab-heading";
import { EventTasks } from "src/modules/tasks";
import { TaskProvider } from "src/modules/tasks/context";
import { useEvent } from "./context";
import { EventLayout } from "./layout";

export const EventTasksView: React.FC<{}> = () => {
  const taskCreate = useDisclosure();
  const { event } = useEvent();

  return (
    <EventLayout>
      <TabHeading heading={`${event.name} - Tasks`}>
        <RenderIfAllowed perms={[Perm.MANAGE_EVENT_TASK]}>
          <Button onClick={taskCreate.onOpen}>Create</Button>
        </RenderIfAllowed>
      </TabHeading>
      <Box overflowY="auto" overflowX="hidden" h="100%" mt="1rem">
        <TaskProvider>
          <EventTasks taskCreate={taskCreate} />
        </TaskProvider>
      </Box>
    </EventLayout>
  );
};
