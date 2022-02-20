import { useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { getAxios } from "@lib/axios";
import { Event } from "@prisma/client";
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

  return <EventTasksView event={event} history={history} />;
};

export const getServerSideProps = withEvent(async ({ event, context }) => {
  const { id: historyId } = context.params;
  const axios = await getAxios(context.req, true);
  const history = historyId
    ? (await axios.get<History>(`/tasks/history/${historyId}`)).data
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

  console.log(event, history);

  return {
    props: {
      event,
      history,
    },
  };
});

export default Tasks;
