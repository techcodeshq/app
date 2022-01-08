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
import { useEvent } from "./context";
import { LinkWithMetadata } from "./links-grid";
import { MemberGrantRow } from "./member-row";
import { GiPayMoney } from "react-icons/gi";

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
  const bgColor = useColorModeValue("bg.100", "bg.800");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useQuery<User[]>("/users");

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
            const data = await toggle({
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent bgColor={bgColor}>
          <ModalHeader>Grant Link</ModalHeader>
          <ModalBody>
            <Grid
              templateColumns={mobileGrid ? "repeat(3, 1fr)" : "repeat(5, 1fr)"}
              gap="2rem"
              padding="1.5rem"
              fontWeight="bold"
            >
              {!mobileGrid && <GridItem>Avatar</GridItem>}
              <GridItem>OSIS</GridItem>
              <GridItem>Name</GridItem>
              {!mobileGrid && <GridItem>Email Address</GridItem>}
              <GridItem>Grant</GridItem>
              {data &&
                data.map((user) => (
                  <React.Fragment key={user.id}>
                    <MemberGrantRow user={user} link={link as EventLink} />
                    <GridItem colSpan={mobileGrid ? 3 : 5}>
                      <Divider />
                    </GridItem>
                  </React.Fragment>
                ))}
            </Grid>
          </ModalBody>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </>
  );
};
