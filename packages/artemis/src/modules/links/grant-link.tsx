import {
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
import { useQuery } from "@hooks/useQuery";
import { User } from "@prisma/client";
import React from "react";
import { UserGrantRow } from "./user-row-grant";
import { QueryLink } from "./query";

export const GrantLink: React.FC<{
  link: QueryLink;
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
                  <UserGrantRow user={user} link={link} key={user.id} />
                ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
