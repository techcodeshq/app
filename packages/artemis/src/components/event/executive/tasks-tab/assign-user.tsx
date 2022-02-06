import {
  Divider,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  Text,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useColorModeValue,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Grid } from "@components/ui/grid";
import { useQuery } from "@hooks/useQuery";
import { EventLink, EventTask, Role, User } from "@prisma/client";
import link from "next/link";
import React from "react";
import { Return } from ".";
import { MemberGrantRow } from "../links-tab/member-row-grant";
import { MemberAssignRow } from "./member-row-assign";

export const AssignUser: React.FC<{
  task: Return;
  isOpen: boolean;
  onClose: () => void;
  assignees: string[];
  refetchUrl: string;
}> = ({ task, onClose, isOpen, assignees, refetchUrl }) => {
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue("bg.100", "bg.800");
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
                data
                  .filter((user) => user.role === Role.EXEC)
                  .map((user) => (
                    <MemberAssignRow
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
