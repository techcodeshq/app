import { useQuery } from "@hooks/useQuery";
import { Branch } from "@prisma/client";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { BranchEventsView } from "src/modules/branch/pages/events";
import { withBranch } from "src/modules/branch/withBranch";

type BranchEventsProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const BranchEventsPage: React.FC<BranchEventsProps> = ({
  branch: fallback,
}) => {
  const router = useRouter();
  const { data: branch } = useQuery<Branch>("/branches/" + router.query.slug, {
    fallbackData: fallback,
  });

  return <BranchEventsView branch={branch} />;
};

export default BranchEventsPage;

export const getServerSideProps = withBranch();
