import { useQuery } from "@hooks/useQuery";
import { Auth } from "@modules/auth";
import { BranchMembersView } from "@modules/branch/pages/members";
import { Branch, BranchMember } from "@prisma/client";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { BranchEventsView } from "src/modules/branch/pages/events";
import { withBranch } from "src/modules/branch/withBranch";

type BranchMembersProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const BranchMembersPage: React.FC<BranchMembersProps> = ({
  branch: fallbackBranch,
  member: fallbackEvent,
}) => {
  const router = useRouter();
  const { data: branch } = useQuery<Branch>("/branches/" + router.query.slug, {
    fallbackData: fallbackBranch,
  });
  const { data: member } = useQuery<BranchMember>(
    `/users/branch/${fallbackBranch.id}`,
    {
      fallbackData: fallbackEvent,
    },
  );

  return (
    <Auth>
      <BranchMembersView branch={branch} member={member} />
    </Auth>
  );
};

export default BranchMembersPage;

export const getServerSideProps = withBranch();
