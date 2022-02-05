import { useQuery } from "@hooks/useQuery";
import { useEvent } from "../context";
import { LinkWithMetadata } from "./links-grid";
import {
  Avatar,
  chakra,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import router, { useRouter } from "next/router";
import { OptionsMenu } from "./options-menu";
import { useMutation } from "@hooks/useMutation";
import { EventLink } from "@prisma/client";

export const LinksList = () => {
  const { event } = useEvent();
  const { data } = useQuery<LinkWithMetadata[]>(`/links/${event.id}`);
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const router = useRouter();
  const toggle = useMutation<EventLink, { id: String; value: boolean }>(
    "/links",
    "patch",
    `/links/${event.id}`,
  );

  return (
    <Flex flexDir="column" gap="1rem">
      {data &&
        data.map((link) => (
          <Flex
            p="1rem"
            bgColor={bgColor}
            borderRadius="0.4rem"
            alignItems="center"
            justifyContent="space-between"
            shadow="md"
            key={link.id}
            onClick={() =>
              router.push(`/event/${event.slug}/link/${link.code}`)
            }
            onAuxClick={(e) => {
              if (e.button === 1) {
                window.open(`/event/${event.slug}/link/${link.code}`, "_blank");
              }
            }}
          >
            <Flex gap="1rem" alignItems="center">
              <Stack spacing={2}>
                <Text fontWeight="500">{link.name}</Text>
                <Text>Uses: {link.uses ?? "Unlimited"}</Text>
              </Stack>
            </Flex>
            <Flex>
              <chakra.span
                bgColor={link.enabled ? "green.300" : "red.300"}
                p="0.2rem"
                h="50%"
                m="auto 0"
                color="bg.800"
                fontWeight="500"
                borderRadius="20px"
                onClick={async (event) => {
                  event.stopPropagation();
                  await toggle({
                    id: link.id,
                    value: !link.enabled,
                  });
                }}
                cursor="pointer"
              >
                {link.enabled ? "Active" : "Inactive"}
              </chakra.span>
              <OptionsMenu link={link} />
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};
