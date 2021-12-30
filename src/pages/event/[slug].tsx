import { Box, Flex, Heading } from "@chakra-ui/react";
import { DashboardProvider } from "@components/dashboard/context";
import { EventProvider } from "@components/event/context";
import EventHeader from "@components/event/header";
import { useQuery } from "@hooks/useQuery";
import { getAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Role } from "@typings";
import type { Event } from "@typings";
import { Session } from "next-auth";
import React from "react";

interface EventProps {
  session: Session;
  slug: string;
  fallback: Event;
}

const Event: React.FC<EventProps> = ({ session, slug, fallback }) => {
  const { data: event } = useQuery<Event>(`/events/${slug}`, {
    fallbackData: fallback,
  });

  return (
    <EventProvider event={event}>
      <Flex flexDirection="column" height="100vh">
        <EventHeader />
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
