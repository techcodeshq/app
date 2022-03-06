import { Box, Button, Flex, Icon, Link, Stack, Text } from "@chakra-ui/react";
import { ContextMenu } from "@components/shared/context-menu";
import { useMutation } from "@hooks/useMutation";
import { EventLink } from "@prisma/client";
import { useRouter } from "next/router";
import { BsPeopleFill } from "react-icons/bs";
import { useEvent } from "../event/pages/context";
import { OptionsMenu } from "./options-menu";
import { QueryLink } from "./query";

export const LinkCard: React.FC<{ link: QueryLink }> = ({ link }) => {
  const { event } = useEvent();
  const router = useRouter();
  const toggle = useMutation<EventLink, { id: String; value: boolean }>(
    "/links",
    "patch",
    `/links/${event.id}`,
  );

  return (
    <Stack
      onClick={() => router.push(`/event/${event.slug}/link/${link.code}`)}
      onAuxClick={(e) => {
        if (e.button === 1) {
          window.open(`/event/${event.slug}/link/${link.code}`, "_blank");
        }
      }}
      bgColor="bg.700"
      minW="12rem"
      h="100%"
      justifyContent="space-between"
      p="1.8rem"
      borderRadius="0.5rem"
      spacing="1rem"
      transition="background-color 0.2s ease-in"
      _hover={{
        cursor: "pointer",
        shadow: "lg",
        bgColor: "bg.650",
        textDecor: "none",
      }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <Text fontSize="1.2rem">{link.name}</Text>
          <Text fontSize="1rem" opacity="50%">
            Uses: {link.uses ?? "Unlimited"}
          </Text>
        </Box>
        <OptionsMenu link={link} />
      </Flex>
      <Flex alignItems="center" gap="1rem">
        <Button
          bgColor={link.enabled ? "green.300" : "red.300"}
          _hover={{
            bgColor: link.enabled ? "green.400" : "red.400",
          }}
          onClick={async (event) => {
            event.stopPropagation();
            await toggle({
              id: link.id,
              value: !link.enabled,
            });
          }}
          color="bg.800"
        >
          {link.enabled ? "Enabled" : "Disabled"}
        </Button>
        <Flex alignItems="center" gap="0.2rem">
          <Icon as={BsPeopleFill} w="1.2rem" h="1.2rem" />
          <Text fontSize="1.1rem">{link._count.redeemedBy}</Text>
        </Flex>
      </Flex>
    </Stack>
  );
};
