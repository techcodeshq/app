import { chakra, Td, Tr, useBreakpointValue } from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { EventLink } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { useEvent } from "../event/pages/context";
import { LinkWithMetadata } from "./links-grid";
import { OptionsMenu } from "./options-menu";

export const LinksRow: React.FC<{
  link: LinkWithMetadata;
}> = ({ link }) => {
  const { event } = useEvent();
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const toggle = useMutation<EventLink, { id: String; value: boolean }>(
    "/links",
    "patch",
    `/links/${event.id}`,
  );
  const router = useRouter();

  return (
    <>
      <Tr
        onClick={() => router.push(`/event/${event.slug}/link/${link.code}`)}
        onAuxClick={(e) => {
          if (e.button === 1) {
            window.open(`/event/${event.slug}/link/${link.code}`, "_blank");
          }
        }}
      >
        <Td whiteSpace="nowrap">{link.name}</Td>
        <Td alignSelf="center">
          {link.uses === null ? "Unlimited" : link.uses}
        </Td>
        {!mobileGrid && (
          <Td alignSelf="center">
            <chakra.span
              bgColor={link.enabled ? "green.300" : "red.300"}
              p="0.5rem"
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
              _hover={{
                bgColor: link.enabled ? "green.400" : "red.500",
                transition: "background-color ease-in 200ms",
              }}
            >
              {link.enabled ? "Active" : "Inactive"}
            </chakra.span>
          </Td>
        )}
        <Td isNumeric>
          <OptionsMenu link={link} />
        </Td>
      </Tr>
    </>
  );
};
