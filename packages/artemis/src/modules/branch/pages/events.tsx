import { Branch } from "@prisma/client";
import { TabHeading } from "@ui/tab-heading";
import { EventsGrid } from "src/modules/event/grid";
import { BranchLayout } from "./layout";

export const BranchEventsView: React.FC<{ branch: Branch }> = ({ branch }) => {
  return (
    <BranchLayout branch={branch}>
      <TabHeading heading="Events">Search * Create</TabHeading>
      <EventsGrid />
    </BranchLayout>
  );
};
