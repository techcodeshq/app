import { Box, Heading } from "@chakra-ui/react";
import axios from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Event } from "@typings/event";
import { Role } from "@typings/role";
import { Session } from "next-auth";
import React from "react";
import useSWR, { SWRConfig } from "swr";

interface EventProps {
  session: Session;
  slug: string;
  fallback: Event;
}

const Event: React.FC<EventProps> = ({ session, slug, fallback }) => {
  const { data } = useSWR(
    `/events/${slug}`,
    async (url) => {
      const res = await axios.get<Event>(url);
      return res.data;
    },
    { fallbackData: fallback }
  );

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
    const res = await axios.get<Event>(`/events/${slug}`, {
      headers: {
        Cookie: `next-auth.session-token=${context.req.cookies["next-auth.session-token"]}`,
      },
    });

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
