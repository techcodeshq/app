import Layout from "@components/dashboard/executive/layout";
import { MembersTab } from "@components/dashboard/executive/members-tab";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Role } from "@prisma/client";

export default () => (
  <Layout tab="Members">
    <MembersTab />
  </Layout>
);

export const getServerSideProps = withOsisRedirect(({ session }) => {
  if (!session || session.user.role !== Role.EXEC)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return { props: { session } };
});
