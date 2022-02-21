import { useQuery } from "@hooks/useQuery";
import { Event } from "@prisma/client";
import { InferGetServerSidePropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { EventLinksView } from "src/modules/event/pages/links";
import { withEvent } from "src/modules/event/withEvent";

type LinksPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Links: NextPage<LinksPageProps> = ({ event: fallback }) => {
  const router = useRouter();
  const { data: event } = useQuery<Event>("/events/" + router.query.slug, {
    fallbackData: fallback,
  });

  return <EventLinksView event={event} />;
};

export const getServerSideProps = withEvent();

export default Links;
