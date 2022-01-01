import { Flex } from "@chakra-ui/react";
import { EventProvider } from "@components/event/context";
import EventHeader from "@components/event/header";
import Tabs from "@components/event/tabs";
import { useQuery } from "@hooks/useQuery";
import { getAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Event, Role } from "@typings";
import { Session } from "next-auth";
import React from "react";

interface EventProps {
  session: Session;
  slug: string;
  fallback: Event;
}

const Event: React.FC<EventProps> = ({ slug, fallback }) => {
  const { data: event } = useQuery<Event>(`/events/${slug}`, {
    fallbackData: fallback,
  });

  return (
    <EventProvider event={event}>
      <Flex flexDirection="column" height="100vh">
        <Tabs />
      </Flex>
    </EventProvider>
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

    const { slug } = context.params;
    const axios = await getAxios(context.req);
    const res = await axios.get<Event>(`/events/${slug}`);

    return {
      props: {
        session,
        slug,
        fallback: {
          [`/events/${slug}`]: res.data,
        },
      },
    };
  }
);

export default Event;
