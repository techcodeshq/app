import {
  AccordionItem,
  AccordionButton,
  Flex,
  Heading,
  Text,
  AccordionIcon,
  AccordionPanel,
  Divider,
  Box,
  useColorModeValue,
  Stack,
  Link,
} from "@chakra-ui/react";
import { EventTask } from "@prisma/client";
import moment from "moment";
import React from "react";
import { Return } from ".";

export const TodoAccordion: React.FC<{
  title: string;
  data: Return;
  filter: (task: EventTask) => boolean;
}> = ({ title, data, filter }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");

  return (
    <AccordionItem border="none" mb="0.5rem">
      <AccordionButton bgColor={bgColor} shadow="sm" _hover={{}} p="1rem">
        <Flex alignItems="center" justifyContent="space-between" w="100%">
          <Heading fontWeight="500" fontSize="1.4rem">
            {title}
          </Heading>
          <Flex alignItems="center" gap="1rem">
            <Text fontWeight="400">{data.filter(filter).length}</Text>
            <AccordionIcon />
          </Flex>
        </Flex>
      </AccordionButton>
      <AccordionPanel pb={4}>
        {data &&
          data
            .filter((task) => !task.completedAt)
            .filter(filter)
            .map((task) => (
              <Box
                key={task.id}
                transition="transform 0.2ms ease-in"
                as={Link}
                _hover={{
                  transform: "translateY(0.1rem)",
                  cursor: "pointer",
                }}
                href={`/event/${task.Event.slug}/tasks/${task.id}`}
              >
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  fontSize="1.2rem"
                  p="1rem 0"
                >
                  <Stack maxW="40%" spacing={0}>
                    <Text isTruncated>{task.name}</Text>
                    <Text isTruncated fontSize="1rem" color="gray.400">
                      {task.Event.name}
                    </Text>
                  </Stack>
                  {task.dueDate && (
                    <Text>{moment(task.dueDate).calendar()}</Text>
                  )}
                </Flex>
                <Divider bgColor="accent.600" />
              </Box>
            ))}
      </AccordionPanel>
    </AccordionItem>
  );
};
