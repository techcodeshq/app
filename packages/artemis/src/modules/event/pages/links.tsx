import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { Event } from "@prisma/client";
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
        <Button onClick={linkCreate.onOpen}>Create</Button>
      </TabHeading>
      <LinksGrid />
      <CreateLink isOpen={linkCreate.isOpen} onClose={linkCreate.onClose} />
    </EventLayout>
  );
};
