import { EventsTab } from "@components/dashboard/executive/events-tab";
import Layout from "@components/dashboard/executive/layout";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Role } from "@typings";

export default () => (
  <Layout tab="Events">
    <EventsTab />
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
