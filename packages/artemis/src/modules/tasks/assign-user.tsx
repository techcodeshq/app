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
import { Return } from ".";
import { UserAssignRow } from "./user-row-assign";

export const AssignUser: React.FC<{
  task: Return;
  isOpen: boolean;
  onClose: () => void;
  assignees: string[];
  refetchUrl: string;
}> = ({ task, onClose, isOpen, assignees, refetchUrl }) => {
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue("bg.100", "bg.700");
  const { data } = useQuery<User[]>("/users");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bgColor={bgColor}>
        <ModalHeader>Assign Task</ModalHeader>
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
                  <UserAssignRow
                    key={user.id}
                    refetchUrl={refetchUrl}
                    user={user}
                    task={task}
                    assign={!assignees.includes(user.id)}
                  />
                ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
