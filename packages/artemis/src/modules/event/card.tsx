import { Text, Stack, Box, Center, Link } from "@chakra-ui/react";
import { MarkdownPreview } from "@components/markdown";
import { Event } from "@prisma/client";

export const EventCard: React.FC<{ event?: Event }> = ({ event }) => {
  return (
    <Stack
      as={Link}
      href={`/event/${event?.slug}/tasks`}
      bgColor="bg.700"
      minW="12rem"
      h="100%"
      justifyContent="space-between"
      p="1.8rem"
      borderRadius="0.5rem"
      spacing="1rem"
      transition="background-color 0.2s ease-in"
      _hover={{
        cursor: "pointer",
        shadow: "lg",
        bgColor: "bg.700",
        textDecor: "none",
      }}
      _focus={{ boxShadow: "none" }}
    >
      <Box>
        <Text>{event?.name || "Name!"}</Text>
        <MarkdownPreview
          content={
            event?.description.length > 100
              ? event?.description.slice(0, 100) + "..."
              : event?.description || "PEANUTS"
          }
          opacity="50%"
        />
      </Box>
      <Box bgColor="bg.600" minW="8rem" p="0.8rem">
        <Center>
          <Text>{new Date(event?.date).toDateString()}</Text>
        </Center>
      </Box>
    </Stack>
  );
};
