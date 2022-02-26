import { useQuery } from "@hooks/useQuery";
import { Auth } from "@modules/auth";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { EventProvider } from "@modules/event/pages/context";
import { Event, Perm } from "@prisma/client";
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

  return (
    <EventProvider event={event}>
      <Auth>
        <RenderIfAllowed isPage={true} perms={[Perm.VIEW_EVENT_LINK]}>
          <EventLinksView event={event} />
        </RenderIfAllowed>
      </Auth>
    </EventProvider>
  );
};

export const getServerSideProps = withEvent();

export default Links;
