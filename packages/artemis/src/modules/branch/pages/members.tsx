import { BranchMembersList } from "@modules/users/branch-list";
import { Branch, BranchMember } from "@prisma/client";
import { TabHeading } from "@ui/tab-heading";
import { BranchLayout } from "./layout";

export const BranchMembersView: React.FC<{
  branch: Branch;
  member: BranchMember;
}> = ({ branch, member }) => {
  return (
    <BranchLayout branch={branch} member={member}>
      <TabHeading heading="Members" />
      <BranchMembersList />
    </BranchLayout>
  );
};
