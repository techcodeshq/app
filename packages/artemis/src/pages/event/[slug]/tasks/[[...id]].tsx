import { useQuery } from "@hooks/useQuery";
import { getAxios } from "@lib/axios";
import { Auth } from "@modules/auth";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { EventProvider } from "@modules/event/pages/context";
import { Event, Perm } from "@prisma/client";
import { InferGetServerSidePropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { EventTasksView } from "src/modules/event/pages/tasks";
import { withEvent } from "src/modules/event/withEvent";
import { History } from "src/types/history";

type TasksPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Tasks: NextPage<TasksPageProps> = ({ event: fallback, history }) => {
  const router = useRouter();
  const { data: event } = useQuery<Event>("/events/" + router.query.slug, {
    fallbackData: fallback,
  });

  return (
    <EventProvider event={event}>
      <Auth>
        <RenderIfAllowed isPage={true} perms={[Perm.VIEW_EVENT_TASK]}>
          <EventTasksView event={event} history={history} />
        </RenderIfAllowed>
      </Auth>
    </EventProvider>
  );
};

export const getServerSideProps = withEvent(async ({ event, context }) => {
  const { id: historyId } = context.params;
  const axios = await getAxios(context.req, true);
  const history = historyId
    ? (
        await axios.get<History>(`/tasks/history/${historyId}`, {
          headers: { branchId: event.branchId },
        })
      ).data
    : {
        data: [
          {
            name: "Root",
            taskId: null,
            parent: `/events/tasks/${event.id}`,
            child: `/events/tasks/${event.id}`,
          },
        ],
        idx: 0,
      };

  return {
    props: {
      event,
      history,
    },
  };
});

export default Tasks;
