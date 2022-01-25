import {
  useDisclosure,
  IconButton,
  useBreakpointValue,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { Layout as SharedLayout } from "@components/shared/layout";
import { useQuery } from "@hooks/useQuery";
import { Session } from "next-auth";
import { EventProvider, EventTabs, useEvent } from "./context";
import { Event } from "@typings";
import {
  Topbar,
  TopbarLeft,
  TopbarRight,
  Sidebar,
  SidebarTop,
  SidebarCenter,
  SidebarBottom,
} from "@components/nav/base-sidebar";
import { NavMenu } from "@components/nav/menu";
import { DeleteItem } from "@components/shared/delete-item";
import { TooltipButton } from "@components/ui/tooltip-button";
import { useRouter } from "next/router";
import { BsPlusLg } from "react-icons/bs";
import { TabButtons } from "./tabs-buttons";

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

export const Layout: React.FC<EventProps> = ({ slug, fallback, children }) => {
  const { data: event } = useQuery<Event>(`/events/${slug}`, {
    fallbackData: fallback,
  });
  const linkCreate = useDisclosure();
  const eventCreate = useDisclosure();

  return (
    <EventProvider event={event}>
      <SharedLayout title={event && event.name}>
        <Nav linkCreate={linkCreate} eventCreate={eventCreate} />
        {children}
      </SharedLayout>
    </EventProvider>
  );
};
