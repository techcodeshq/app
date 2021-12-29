import {
  Box,
  Button,
  useDisclosure,
  Grid,
} from "@chakra-ui/react";
import React from "react";
import { TabLayout } from "../tab-layout";
import { CreateEvent } from "./create-event";
import type { Event } from "@typings";
import { EventCard } from "./event-card";
import { useQuery } from "@hooks/useQuery";

export const EventsTab: React.FC = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useQuery<Event[]>("/events");

  return (
    <TabLayout>
      <Box pt="2rem">
        <Button width="10rem" onClick={onOpen}>
          New Event
        </Button>
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={8}
          mt="2rem"
        >
          {data &&
            data.map((event: Event) => <EventCard event={event} key={event.id} />)}
        </Grid>
      </Box>
      <CreateEvent isOpen={isOpen} onClose={onClose} />
    </TabLayout>
  );
};
