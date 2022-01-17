import {
  IconButton,
  useBreakpointValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import {
  EventProvider,
  EventTabs,
  useEvent,
} from "@components/event/executive/context";
import Tabs from "@components/event/executive/tabs";
import { TabButtons } from "@components/event/executive/tabs-buttons";
import {
  Sidebar,
  SidebarBottom,
  SidebarCenter,
  SidebarTop,
  Topbar,
  TopbarLeft,
  TopbarRight,
} from "@components/nav/base-sidebar";
import { NavMenu } from "@components/nav/menu";
import { DeleteItem } from "@components/shared/delete-item";
import { Layout } from "@components/shared/layout";
import { TooltipButton } from "@components/ui/tooltip-button";
import { useQuery } from "@hooks/useQuery";
import { getAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Event, Role } from "@typings";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import { BsPlusLg } from "react-icons/bs";

interface EventProps {
  session: Session;
  slug: string;
  fallback: Event;
}

const Nav: React.FC<{
  linkCreate: UseDisclosureReturn;
  eventCreate: UseDisclosureReturn;
}> = ({ linkCreate, eventCreate }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();
  const { selectedTab, setSelectedTab, event } = useEvent();

  return (
    <>
      {isMobile ? (
        <Topbar>
          <TopbarLeft />
          <TopbarRight signOutBtn={false}>
            <IconButton
              variant="ghost"
              width="2.5rem"
              height="2.5rem"
              icon={<BsPlusLg />}
              aria-label={`Create ${selectedTab}`}
              onClick={
                selectedTab === EventTabs.LINKS
                  ? linkCreate.onOpen
                  : eventCreate.onOpen
              }
            />
            <NavMenu setSelectedTab={setSelectedTab} tabs={EventTabs} />
          </TopbarRight>
        </Topbar>
      ) : (
        <Sidebar>
          <SidebarTop />
          <SidebarCenter>
            <TabButtons />
          </SidebarCenter>
          <SidebarBottom>
            <TooltipButton
              label={`Create ${selectedTab}`}
              placement="right"
              variant="ghost"
              icon={<BsPlusLg />}
              onClick={
                selectedTab === EventTabs.LINKS
                  ? linkCreate.onOpen
                  : eventCreate.onOpen
              }
            />
            <DeleteItem
              url={`/events/${event.id}`}
              itemName={event.name}
              refetchUrl="/events"
              postDelete={async () => {
                router.push("/dashboard");
              }}
              warningText="Are you sure you want to delete this event? Only do this if the event has no links, or they are all unused"
              variant="ghost"
              bgColor={null}
            />
          </SidebarBottom>
        </Sidebar>
      )}
    </>
  );
};

const Event: React.FC<EventProps> = ({ slug, fallback }) => {
  const { data: event } = useQuery<Event>(`/events/${slug}`, {
    fallbackData: fallback,
  });
  const linkCreate = useDisclosure();
  const eventCreate = useDisclosure();

  return (
    <EventProvider event={event}>
      <Layout title={event && event.name}>
        <Nav linkCreate={linkCreate} eventCreate={eventCreate} />
        <Tabs linkCreate={linkCreate} eventCreate={eventCreate} />
      </Layout>
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
        fallback: res.data,
      },
    };
  }
);

export default Event;
