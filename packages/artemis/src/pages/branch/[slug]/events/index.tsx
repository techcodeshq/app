import { InferGetServerSidePropsType } from "next";
import { BranchEventsView } from "src/modules/branch/pages/events";
import { withBranch } from "src/modules/branch/withBranch";

type BranchEventsProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const BranchEventsPage: React.FC<BranchEventsProps> = ({ branch }) => {
  return <BranchEventsView branch={branch} />;
};

export default BranchEventsPage;

export const getServerSideProps = withBranch();
