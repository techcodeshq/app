import {
  Box,
  HStack,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from "@chakra-ui/react";
import { BsCalendarEventFill, BsPersonFill } from "react-icons/bs";
import { QueryBranch } from "./query";

export const BranchCard: React.FC<{ branch: QueryBranch }> = ({ branch }) => {
  return (
    <Stack
      bgColor="bg.700"
      minW="16rem"
      h="100%"
      display="flex"
      justifyContent="space-between"
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
          {branch.name}
        </Text>
        {/* <Text fontSize="1rem">345 Chambers St, New York, NY</Text> */}
      </Box>
      <HStack>
        <Tag size="md" variant="subtle" colorScheme="cyan">
          <TagLeftIcon boxSize="12px" as={BsPersonFill} />
          <TagLabel>{branch.members.length} Members</TagLabel>
        </Tag>
        <Tag size="md" variant="subtle" colorScheme="accent">
          <TagLeftIcon boxSize="12px" as={BsCalendarEventFill} />
          <TagLabel>{branch.events.length} Events</TagLabel>
        </Tag>
      </HStack>
    </Stack>
  );
};
