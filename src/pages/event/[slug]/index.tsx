import {
  Flex,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { DashboardTabs } from "@components/dashboard/executive/context";
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
import { Layout } from "@components/shared/layout";
import { useQuery } from "@hooks/useQuery";
import { getAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { Event, Role } from "@typings";
import { Session } from "next-auth";
import React from "react";
import { BsPlusLg } from "react-icons/bs";

interface EventProps {
  session: Session;
  slug: string;
  fallback: Event;
}

const Nav: React.FC<{ linkCreate: UseDisclosureReturn }> = ({ linkCreate }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { setSelectedTab } = useEvent();

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
              aria-label={`create link`}
              onClick={linkCreate.onOpen}
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
            <IconButton
              variant="ghost"
              width="2.5rem"
              height="2.5rem"
              icon={<BsPlusLg />}
              aria-label={`create link`}
              onClick={linkCreate.onOpen}
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
  const isMobile = useBreakpointValue({ base: true, md: false });
  const linkCreate = useDisclosure();

  return (
    <EventProvider event={event}>
      <Layout title={event && event.name}>
        <Nav linkCreate={linkCreate} />
        <Tabs linkCreate={linkCreate} />
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
