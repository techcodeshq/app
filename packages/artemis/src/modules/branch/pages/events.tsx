import { Button, useDisclosure } from "@chakra-ui/react";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { Branch, BranchMember, Perm } from "@prisma/client";
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
        <RenderIfAllowed perms={[Perm.MANAGE_EVENT]}>
          <Button onClick={onOpen}>Create</Button>
        </RenderIfAllowed>
      </TabHeading>
      <EventsGrid />
      <CreateEvent isOpen={isOpen} onClose={onClose} />
    </BranchLayout>
  );
};
