import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { EventCard } from "../event/card";

export const BranchCard: React.FC = () => {
  return (
    <Stack
      bgColor="bg.700"
      minW="25rem"
      p="1.8rem"
      borderRadius="0.5rem"
      spacing="1rem"
      transition="transform 0.2s ease-in"
      _hover={{
        cursor: "pointer",
        shadow: "lg",
        transform: "scale(1.02)",
      }}
    >
      <Box>
        <Text fontSize="1.5rem" fontWeight="medium">
          Stuyvesant High School
        </Text>
        <Text fontSize="1rem">345 Chambers St, New York, NY</Text>
      </Box>
      <Text fontSize="1rem" opacity="50%">
        Next Event
      </Text>
      <EventCard bgColor="bg.600" />
    </Stack>
  );
};
