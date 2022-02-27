import { Auth } from "@modules/auth";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { EventProvider } from "@modules/event/pages/context";
import { Perm } from "@prisma/client";
import { NextPage } from "next";
import { EventTasksView } from "src/modules/event/pages/tasks";

const Tasks: NextPage = ({}) => {
  return (
    <EventProvider>
      <Auth>
        <RenderIfAllowed isPage={true} perms={[Perm.VIEW_EVENT_TASK]}>
          <EventTasksView />
        </RenderIfAllowed>
      </Auth>
    </EventProvider>
  );
};

export default Tasks;
