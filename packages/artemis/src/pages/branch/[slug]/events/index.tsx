import { useQuery } from "@hooks/useQuery";
import { Auth } from "@modules/auth";
import { BranchProvider } from "@modules/branch/pages/context";
import { Branch, BranchMember } from "@prisma/client";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { BranchEventsView } from "src/modules/branch/pages/events";
import { withBranch } from "src/modules/branch/withBranch";

type BranchEventsProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const BranchEventsPage: React.FC<BranchEventsProps> = ({
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
    <BranchProvider branch={branch} member={member}>
      <Auth>
        <BranchEventsView branch={branch} member={member} />
      </Auth>
    </BranchProvider>
  );
};

export default BranchEventsPage;

export const getServerSideProps = withBranch();
