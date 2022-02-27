import { Auth } from "@modules/auth";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { EventProvider } from "@modules/event/pages/context";
import { Perm } from "@prisma/client";
import { NextPage } from "next";
import { EventLinksView } from "src/modules/event/pages/links";

const Links: NextPage = () => {
  return (
    <EventProvider>
      <Auth>
        <RenderIfAllowed isPage={true} perms={[Perm.VIEW_EVENT_LINK]}>
          <EventLinksView />
        </RenderIfAllowed>
      </Auth>
    </EventProvider>
  );
};

export default Links;
