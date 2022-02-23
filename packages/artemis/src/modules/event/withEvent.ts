import { getAxios } from "@lib/axios";
import { Branch, Event } from "@prisma/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type ContextWithEvent = {
  event: Event;
  context: GetServerSidePropsContext;
};

export const withEvent = (
  gssp: (
    args: ContextWithEvent,
  ) =>
    | GetServerSidePropsResult<{ event: Event } & Record<string, any>>
    | Promise<
        GetServerSidePropsResult<{ event: Event } & Record<string, any>>
      > = ({ event }) => ({
    props: { event },
  }),
) => {
  return async (context: GetServerSidePropsContext) => {
    const axios = await getAxios(context.req, true);
    const res = await axios.get<Event>("/events/" + context.params.slug);

    return gssp({ event: res.data, context });
  };
};
