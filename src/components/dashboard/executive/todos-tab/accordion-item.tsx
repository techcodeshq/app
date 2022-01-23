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
} from "@chakra-ui/react";
import { EventTask } from "@typings";
import moment from "moment";
import Link from "next/link";
import React from "react";

export const TodoAccordion: React.FC<{
  title: string;
  data: EventTask[];
  filter: (task: EventTask) => boolean;
}> = ({ title, data, filter }) => (
  <AccordionItem border="none" mb="0.5rem">
    <AccordionButton bgColor="bg.800" shadow="md" _hover={{}} p="1rem">
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <Heading fontWeight="500" fontSize="2rem">
          {title}
        </Heading>
        <AccordionIcon />
      </Flex>
    </AccordionButton>
    <AccordionPanel pb={4}>
      {data &&
        data.filter(filter).map((task) => (
          <Box
            key={task.id}
            transition="transform 0.2ms ease-in"
            _hover={{ transform: "translateY(0.1rem)", cursor: "pointer" }}
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              fontSize="1.5rem"
              p="1rem 0"
            >
              <Text>{task.name}</Text>
              <Text>{moment(task.dueDate).calendar()}</Text>
            </Flex>
            <Divider bgColor="accent.600" />
          </Box>
        ))}
    </AccordionPanel>
  </AccordionItem>
);
