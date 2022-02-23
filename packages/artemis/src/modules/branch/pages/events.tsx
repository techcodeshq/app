import { Button, useDisclosure } from "@chakra-ui/react";
import { Branch, BranchMember } from "@prisma/client";
import { TabHeading } from "@ui/tab-heading";
import { CreateEvent } from "src/modules/event/create-event";
import { EventsGrid } from "src/modules/event/grid";
import { BranchLayout } from "./layout";

export const BranchEventsView: React.FC<{
  branch: Branch;
  member: BranchMember;
}> = ({ branch, member }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <BranchLayout branch={branch} member={member}>
      <TabHeading heading="Events">
        <Button onClick={onOpen}>Create</Button>
      </TabHeading>
      <EventsGrid />
      <CreateEvent isOpen={isOpen} onClose={onClose} />
    </BranchLayout>
  );
};
