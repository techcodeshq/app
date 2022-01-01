import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  GridItem,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { EventLink } from "@typings";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { useEvent } from "./context";
import { LinkActionPopover } from "./link-action-popover";
import { LinkWithMetadata } from "./links-grid";

export const LinksRow: React.FC<{
  link: LinkWithMetadata;
}> = ({ link }) => {
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const { event } = useEvent();
  const toggle = useMutation<EventLink, { id: String; value: boolean }>(
    "/links",
    "patch",
    `/links/${event.id}`
  );

  return (
    <>
      <GridItem>
        <Text width="80%" isTruncated>
          {link.name}
        </Text>
      </GridItem>
      {!mobileGrid && (
        <GridItem alignSelf="center">
          <Text width="10vmax" textAlign="left" isTruncated>
            {link.uses === null ? "Unlimited" : link.uses}
          </Text>
        </GridItem>
      )}
      <GridItem alignSelf="center">
        <chakra.span
          bgColor={link.enabled ? "green.300" : "red.300"}
          p="0.5rem"
          color="bg.800"
          fontWeight="500"
          borderRadius="20px"
          onClick={async () => {
            console.log(link.id);
            const data = await toggle({
              id: link.id,
              value: !link.enabled,
            });

            console.log(data);
          }}
          cursor="pointer"
          _hover={{
            bgColor: link.enabled ? "green.400" : "red.500",
            transition: "background-color ease-in 200ms",
          }}
        >
          {link.enabled ? "Active" : "Inactive"}
        </chakra.span>
      </GridItem>
      <GridItem alignSelf="center">
        <Flex alignItems="center" justifyContent="space-between">
          {link.metadata && <LinkActionPopover metadata={link.metadata} />}
          {!link.metadata && (
            <Text width="10vmax" textAlign="left" isTruncated>
              This link has no actions!
            </Text>
          )}
          <Link href={`/event/${event.slug}/link/${link.code}`}>
            <IconButton
              variant="outline"
              aria-label="view"
              icon={<ExternalLinkIcon />}
            />
          </Link>
        </Flex>
      </GridItem>
    </>
  );
};
