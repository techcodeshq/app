import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import type { Event } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";

export const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const router = useRouter();

  const hexToRgba = (hex: string, opacity: string) => {
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const color = r + "," + g + "," + b;

    return `rgba(${color}, ${opacity})`;
  };

  return (
    <Flex
      flexDirection="column"
      bgColor={bgColor}
      justifyContent="space-between"
      borderRadius="0.4rem"
      transition="transform 0.2s ease-in"
      onClick={() =>
        router.push({
          pathname: "/event/[slug]/links",
          query: { slug: event.slug },
        })
      }
      _hover={{
        cursor: "pointer",
        shadow: "lg",
        transform: "scale(1.02)",
      }}
    >
      <Box bgColor={hexToRgba(event.color, "0.6")} p="2rem" h="100%">
        <Heading fontWeight="500">{event.name}</Heading>
        <Text>{event.description}</Text>
      </Box>
      <Box p="2rem" />
    </Flex>
  );
};
