import { Box, Heading } from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { getAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Event } from "@typings/event";
import { Role } from "@typings/role";
import { Session } from "next-auth";
import React from "react";

interface EventProps {
  session: Session;
  slug: string;
  fallback: Event;
}

const Event: React.FC<EventProps> = ({ session, slug, fallback }) => {
  // const { data } = useSWR(
  //   `/events/${slug}`,
  //   async (url) => {
  //     const res = await axios.get<Event>(url);
  //     return res.data;
  //   },
  //   { fallbackData: fallback }
  // );

  const { data } = useQuery<Event>(`/events/${slug}`, {
    fallbackData: fallback,
  });

  return <Heading>{data.name}</Heading>;
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

    const { slug } = await context.params;
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
