import { Button, useDisclosure } from "@chakra-ui/react";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { Event, Perm } from "@prisma/client";
import { TabHeading } from "@ui/tab-heading";
import { CreateLink } from "src/modules/links/create-link";
import { LinksGrid } from "src/modules/links/links-grid";
import { EventLayout } from "./layout";

export const EventLinksView: React.FC<{
  event: Event;
}> = ({ event }) => {
  const linkCreate = useDisclosure();

  return (
    <EventLayout event={event}>
      <TabHeading heading={`${event.name} - Links`}>
        <RenderIfAllowed perms={[Perm.MANAGE_EVENT_LINK]}>
          <Button onClick={linkCreate.onOpen}>Create</Button>
        </RenderIfAllowed>
      </TabHeading>
      <LinksGrid />
      <CreateLink isOpen={linkCreate.isOpen} onClose={linkCreate.onClose} />
    </EventLayout>
  );
};
