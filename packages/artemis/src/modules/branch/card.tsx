import {
  Box,
  HStack,
  Link,
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
      as={Link}
      href={`/branch/${branch.slug}/events`}
      bgColor="bg.700"
      minW="16rem"
      h="100%"
      display="flex"
      justifyContent="space-between"
      p="1.8rem"
      borderRadius="0.5rem"
      spacing="1rem"
      transition="background-color 0.2s ease-in"
      _hover={{
        cursor: "pointer",
        shadow: "lg",
        textDecor: "none",
        bgColor: "bg.650",
      }}
      _focus={{ boxShadow: "none" }}
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
          <TagLabel>
            {branch.members.length +
              ` Member${branch.members.length === 1 ? "" : "s"}`}
          </TagLabel>
        </Tag>
        <Tag size="md" variant="subtle" colorScheme="accent">
          <TagLeftIcon boxSize="12px" as={BsCalendarEventFill} />
          <TagLabel>
            {branch.events.length +
              ` Event${branch.events.length === 1 ? "" : "s"}`}
          </TagLabel>
        </Tag>
      </HStack>
    </Stack>
  );
};
