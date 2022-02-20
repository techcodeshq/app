import { Text, Stack, Box, Center, Link } from "@chakra-ui/react";
import { Event } from "@prisma/client";

export const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <Stack
      as={Link}
      href={`/event/${event.slug}/tasks`}
      bgColor="bg.700"
      minW="12rem"
      h="100%"
      justifyContent="space-between"
      p="1.8rem"
      borderRadius="0.5rem"
      spacing="1rem"
      transition="transform 0.2s ease-in"
      _hover={{
        cursor: "pointer",
        shadow: "lg",
        transform: "scale(1.02)",
        textDecor: "none",
      }}
      _focus={{ boxShadow: "none" }}
    >
      <Box>
        <Text>{event.name}</Text>
        <Text opacity="50%">{event.description}</Text>
      </Box>
      <Box bgColor="bg.600" minW="8rem" p="0.8rem">
        <Center>
          <Text>{new Date(event.date).toDateString()}</Text>
        </Center>
      </Box>
    </Stack>
  );
};
