import { LinkDashboard } from "@components/event/executive/link-dashboard";
import { MemberLinkRedeem } from "@components/event/member";
import { useQuery } from "@hooks/useQuery";
import { getAxios } from "@lib/axios";
import { Auth } from "@modules/auth";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { EventProvider } from "@modules/event/pages/context";
import { withEvent } from "@modules/event/withEvent";
import { Event, EventLink, LinkApplyInstructions, Perm } from "@prisma/client";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import React from "react";

interface LinkPageProps {
  session: Session;
  code: string;
  fullUrl: string;
  fallback: EventLink & { metadata: LinkApplyInstructions[] };
  event: Event;
}

const LinkPage: React.FC<LinkPageProps> = ({
  session,
  fallback,
  code,
  fullUrl,
  event: eventFallback,
}) => {
  const { data: link } = useQuery<
    EventLink & { metadata: LinkApplyInstructions[] }
  >(`/links/code/${code}`, {
    fallbackData: fallback,
  });
  const { data: event } = useQuery<Event>("/events/" + eventFallback.slug, {
    fallbackData: eventFallback,
  });

  return (
    <EventProvider event={event}>
      <Auth>
        <RenderIfAllowed perms={[Perm.VIEW_EVENT_LINK]}>
          {(allowed) => {
            if (allowed) {
              return <LinkDashboard link={link} fullUrl={fullUrl} />;
            } else {
              return (
                <MemberLinkRedeem
                  session={session}
                  link={link}
                  code={code}
                  redeem={!allowed}
                />
              );
            }
          }}
        </RenderIfAllowed>
      </Auth>
    </EventProvider>
  );
  // switch (session.user.role) {
  //   case Role.EXEC:
  //     return <LinkDashboard link={link} fullUrl={fullUrl} />;
  //   case Role.MEMBER:
  //     return <MemberLinkRedeem session={session} link={link} code={code} />;
  // }
};

export const getServerSideProps = withEvent(async ({ event, context }) => {
  const session = await getSession(context);
  const axios = await getAxios(context.req);
  const res = await axios.get<
    EventLink & { metadata: LinkApplyInstructions[] }
  >(`/links/code/${context.params.code}`);

  return {
    props: {
      event,
      session,
      fullUrl: (process.env.NEXTAUTH_URL + context.resolvedUrl).split("?")[0],
      code: context.params.code,
      fallback: res.data,
    },
  };
});

export default LinkPage;
