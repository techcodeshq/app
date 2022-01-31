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
} from "@chakra-ui/react";
import { Grid } from "@components/ui/grid";
import { useQuery } from "@hooks/useQuery";
import { EventLink, EventTask, Role, User } from "@prisma/client";
import React from "react";
import { Return } from ".";
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
          <Grid
            templateColumns={mobileGrid ? "repeat(3, 1fr)" : "repeat(5, 1fr)"}
          >
            {!mobileGrid && <GridItem>Avatar</GridItem>}
            <GridItem>OSIS</GridItem>
            <GridItem>Name</GridItem>
            {!mobileGrid && <GridItem>Email Address</GridItem>}
            <GridItem>Assign</GridItem>
            {data &&
              data
                .filter((uesr) => uesr.role === Role.EXEC)
                .map((user) => (
                  <React.Fragment key={user.id}>
                    <MemberAssignRow
                      // setSelectedTask={setSelectedTask}
                      refetchUrl={refetchUrl}
                      user={user}
                      task={task}
                      assign={!assignees.includes(user.id)}
                    />
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
