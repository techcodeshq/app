import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  GridItem,
  IconButton,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { DeleteItem } from "@components/shared/delete-item";
import { useMutation } from "@hooks/useMutation";
import { EventLink } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { GiPayMoney } from "react-icons/gi";
import { FaRegCopy } from "react-icons/fa";
import { useEvent } from "../context";
import { GrantLink } from "./grant-link";
import { LinkWithMetadata } from "./links-grid";
import { CreateLink } from "./create-link";

export const LinksRow: React.FC<{
  link: LinkWithMetadata;
}> = ({ link }) => {
  const { event } = useEvent();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: linkIsOpen,
    onOpen: linkOnOpen,
    onClose: linkOnClose,
  } = useDisclosure();
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const toggle = useMutation<EventLink, { id: String; value: boolean }>(
    "/links",
    "patch",
    `/links/${event.id}`,
  );
  const color = useColorModeValue("bg.100", "bg.800");

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
        <Flex justifyContent="space-between">
          <IconButton
            onClick={onOpen}
            aria-label="apply-manual"
            icon={<GiPayMoney />}
            disabled={!link.enabled}
          />
          <IconButton
            icon={<FaRegCopy />}
            onClick={linkOnOpen}
            aria-label="duplicate"
          />
          <DeleteItem
            url={`/links/${link.id}`}
            itemName={link.name}
            refetchUrl={`/links/${event.id}`}
            warningText={
              "Are you sure you would like to delete this link? Only do this for links that were created accidentally and have no uses yet."
            }
            iconColor={color}
          />
        </Flex>
      </GridItem>

      <GrantLink isOpen={isOpen} onClose={onClose} link={link} />
      <CreateLink
        isOpen={linkIsOpen}
        onClose={linkOnClose}
        initialValues={{
          name: "",
          uses: link.uses?.toString(),
          actions: link.metadata.map((data) => ({
            key: data.key,
            value: data.value.toString(),
            public: data.public,
            action: data.action,
          })),
        }}
      />
    </>
  );
};
