import { BranchMembersList } from "@modules/users/branch-list";
import { TabHeading } from "@ui/tab-heading";
import { BranchLayout } from "./layout";

export const BranchMembersView: React.FC = () => {
  return (
    <BranchLayout>
      <TabHeading heading="Members" />
      <BranchMembersList />
    </BranchLayout>
  );
};
