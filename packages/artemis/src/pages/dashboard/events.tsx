import { useDisclosure } from "@chakra-ui/react";
import { EventsTab } from "@components/dashboard/executive/events-tab";
import Layout from "@components/dashboard/executive/layout";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Role } from "@prisma/client";

export default () => {
  const eventCreate = useDisclosure();

  return (
    <Layout tab="Events" eventCreate={eventCreate}>
      <EventsTab createControl={eventCreate} />
    </Layout>
  );
};

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
