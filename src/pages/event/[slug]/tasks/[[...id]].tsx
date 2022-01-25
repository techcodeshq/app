import { useDisclosure } from "@chakra-ui/react";
import { Layout } from "@components/event/executive/layout";
import { TasksTab } from "@components/event/executive/tasks-tab";
import { TaskProvider } from "@components/event/executive/tasks-tab/context";
import { getAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Event, Role } from "@typings";
import { History } from "src/types/history";
import { NextPage } from "next";
import { Session } from "next-auth";

interface TasksPageProps {
  session: Session;
  slug: string;
  fallback: Event;
  history: History;
}

const Tasks: NextPage<TasksPageProps> = ({
  session,
  slug,
  fallback,
  history,
}) => {
  const eventCreate = useDisclosure();

  return (
    <Layout session={session} slug={slug} fallback={fallback}>
      <TaskProvider history={history}>
        <TasksTab eventCreate={eventCreate} />
      </TaskProvider>
    </Layout>
  );
};

export const getServerSideProps = withOsisRedirect(
  async ({ session, context }) => {
    if (!session || session.user.role !== Role.EXEC) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const { slug, id: historyId } = context.params;
    const axios = await getAxios(context.req);
    const event = await axios.get<Event>(`/events/${slug}`);
    const history = historyId
      ? (await axios.get<History>(`/tasks/history/${historyId}`)).data
      : {
          data: [
            {
              name: "Root",
              taskId: null,
              parent: `/events/tasks/${event.data.id}`,
              child: `/events/tasks/${event.data.id}`,
            },
          ],
          idx: 0,
        };

    return {
      props: {
        session,
        slug,
        fallback: event.data,
        history: history,
      },
    };
  },
);

export default Tasks;
