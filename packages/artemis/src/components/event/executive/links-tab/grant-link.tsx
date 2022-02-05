import {
  Divider,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { MemberRow } from "@components/dashboard/executive/members-tab/member-row";
import { Grid } from "@components/ui/grid";
import { useQuery } from "@hooks/useQuery";
import { EventLink, User } from "@prisma/client";
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
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                {!mobileGrid && <Th>Avatar</Th>}
                <Th>Name</Th>
                {!mobileGrid && <Th>Email</Th>}
                <Th>Grant</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data &&
                data.map((user) => (
                  <MemberGrantRow user={user} link={link} key={user.id} />
                ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
