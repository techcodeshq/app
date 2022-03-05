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
  const bgColor = useColorModeValue("bg.100", "bg.700");

  return (
    <AccordionItem border="none" mb="0.5rem">
      <AccordionButton
        bgColor={bgColor}
        shadow="sm"
        _hover={{}}
        p="1rem"
        borderRadius="0.5rem"
      >
        <Flex alignItems="center" justifyContent="space-between" w="100%">
          <Heading fontWeight="500" fontSize="1.4rem">
            {title}
          </Heading>
          <Flex alignItems="center" gap="1rem">
            <Text fontWeight="400">
              {data?.filter((task) => !task.completedAt).filter(filter).length}
            </Text>
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
                  textDecor: "none",
                  transform: "scale(1.02)",
                  cursor: "pointer",
                }}
                href={`/event/${task.event.slug}/tasks/${task.id}`}
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
                      {task.event.name}
                    </Text>
                  </Stack>
                  {task.dueDate && (
                    <Text color="green.300">
                      {moment(task.dueDate).calendar()}
                    </Text>
                  )}
                </Flex>
                <Divider />
              </Box>
            ))}
      </AccordionPanel>
    </AccordionItem>
  );
};
