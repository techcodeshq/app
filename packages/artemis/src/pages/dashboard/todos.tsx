import Layout from "@components/dashboard/executive/layout";
import { TodosTab } from "@components/dashboard/executive/todos-tab";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Role } from "@typings";

export default () => (
  <Layout tab="To-Do">
    <TodosTab />
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
