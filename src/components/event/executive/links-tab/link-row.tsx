import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  Divider,
  Grid,
  GridItem,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import { EventLink, User } from "@typings";
import Link from "next/link";
import React from "react";
import { useEvent } from "../../context";
import { LinkWithMetadata } from "./links-grid";
import { MemberGrantRow } from "./member-row";
import { GiPayMoney } from "react-icons/gi";
import { GrantLink } from "./grant-link";

export const LinksRow: React.FC<{
  link: LinkWithMetadata;
}> = ({ link }) => {
  const { event } = useEvent();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mobileGrid = useBreakpointValue({ base: true, md: false });
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
      </GridItem>
      <GridItem alignSelf="center">
        <Link href={`/event/${event.slug}/link/${link.code}`}>
          <Button
            aria-label="view"
            icon={<ExternalLinkIcon />}
            children="View Details"
          />
        </Link>
      </GridItem>
      <GridItem>
        <IconButton
          onClick={onOpen}
          aria-label="apply-manual"
          icon={<GiPayMoney />}
          disabled={!link.enabled}
        />
      </GridItem>

      <GrantLink isOpen={isOpen} onClose={onClose} link={link} />
    </>
  );
};
