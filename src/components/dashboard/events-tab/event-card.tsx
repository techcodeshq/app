import {
  Box,
  chakra,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "@lib/axios";
import { Event } from "@typings/event";
import React from "react";
import NextLink from "next/link";
import useSWR from "swr";

const Link = chakra(NextLink);

export const EventCard: React.FC<{ event: Event }> = ({ event }) => {
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
    <Link
      _hover={{ textDecor: "none" }}
      href={{
        pathname: "/event/[slug]",
        query: { slug: event.slug },
      }}
    >
      <Flex
        flexDirection="column"
        bgColor={bgColor}
        justifyContent="space-between"
        borderRadius="0.4rem"
        transition="background-color 0.2s ease-in"
        _hover={{
          cursor: "pointer",
          // bgColor: hexToRgba(event.color, "0.8"),
        }}
      >
        <Box bgColor={hexToRgba(event.color, "0.5")} p="2rem">
          <Heading>{event.name}</Heading>
          <Text>{event.description}</Text>
        </Box>
        <Text p="2rem">{new Date(event.date).toLocaleDateString()}</Text>
      </Flex>
    </Link>
  );
};
