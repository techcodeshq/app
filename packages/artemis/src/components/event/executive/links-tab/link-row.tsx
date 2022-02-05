import { CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  IconButton,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  Flex,
  Td,
  Tbody,
  Tr,
  Box,
} from "@chakra-ui/react";
import { DeleteItem } from "@components/shared/delete-item";
import { useMutation } from "@hooks/useMutation";
import { EventLink } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { GiPayMoney } from "react-icons/gi";
import { FaRegCopy } from "react-icons/fa";
import { useEvent } from "../context";
import { GrantLink } from "./grant-link";
import { LinkWithMetadata } from "./links-grid";
import { CreateLink } from "./create-link";
import { ContextMenu } from "@components/shared/context-menu";
import { ContextItem } from "@components/shared/context-item";
import { BsTrash } from "react-icons/bs";
import { useRouter } from "next/router";
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
