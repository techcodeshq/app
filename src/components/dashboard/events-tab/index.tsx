import {
  Box,
  Button,
  Heading,
  useDisclosure,
  Text,
  Flex,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "@lib/axios";
import React from "react";
import useSWR from "swr";
import { TabLayout } from "../tab-layout";
import { CreateEvent } from "./create-event";
import { Event } from "@typings/event";
import { EventCard } from "./event-card";

export const EventsTab: React.FC = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useSWR("/events", async (url) => {
    const res = await axios.get<Event[]>(url);
    return res.data;
  });
  const bgColor = useColorModeValue("bg.100", "bg.800");

  const hexToRgba = (hex: string, opacity: string) => {
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const color = r + "," + g + "," + b;

    return `rgba(${color}, ${opacity})`;
  };

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
            data.map((event) => <EventCard event={event} key={event.id} />)}
        </Grid>
      </Box>
      <CreateEvent isOpen={isOpen} onClose={onClose} />
    </TabLayout>
  );
};
