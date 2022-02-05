import {
  Box,
  Button,
  Grid,
  GridItem,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import type { Event } from "@prisma/client";
import React from "react";
import { CreateEvent } from "./create-event";
import { EventCard } from "./event-card";

export const EventsTab: React.FC<{ createControl: UseDisclosureReturn }> = ({
  createControl,
}) => {
  const { isOpen, onOpen, onClose } = createControl;
  const { data } = useQuery<Event[]>("/events");

  return (
    <>
      <Box pt="2rem">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gridAutoRows="12rem"
          gridAutoFlow="dense"
          gap={8}
        >
          {data &&
            data.map((event: Event) => (
              <GridItem>
                <EventCard event={event} key={event.id} />
              </GridItem>
            ))}
        </Grid>
      </Box>
      <CreateEvent isOpen={isOpen} onClose={onClose} />
    </>
  );
};
