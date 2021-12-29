import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { SVGLink } from "@components/nav/sidebar";
import { Event } from "@typings/event";
import { signOut } from "next-auth/react";
import React from "react";
import { FiLogOut } from "react-icons/fi";

interface EventHeader {
  event: Event;
}

const EventHeader: React.FC<EventHeader> = ({ event }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");

  return (
    <Box width="100%" bgColor={bgColor} p="1.2rem">
      <Flex
        width="95%"
        margin="0 auto"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex>
          <SVGLink to="/dashboard" src="/logo.svg" alt="Logo" />
          <Heading fontWeight={600} fontSize="2rem">
            Web Dev
          </Heading>
        </Flex>
        <Flex>
          <Button>Links</Button>
          <Button>Tasks</Button>
        </Flex>
        <Flex>
          <IconButton
            width="2.5rem"
            height="2.5rem"
            icon={<FiLogOut />}
            aria-label="log out"
            onClick={() => signOut()}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default EventHeader;
