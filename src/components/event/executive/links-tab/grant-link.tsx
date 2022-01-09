import {
  Divider,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { EventLink, User } from "@typings";
import React from "react";
import { LinkWithMetadata } from "./links-grid";
import { MemberGrantRow } from "./member-row-grant";

export const GrantLink: React.FC<{
  link: LinkWithMetadata;
  isOpen: boolean;
  onClose: () => void;
}> = ({ link, onClose, isOpen }) => {
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const { data } = useQuery<User[]>("/users");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
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
  );
};
