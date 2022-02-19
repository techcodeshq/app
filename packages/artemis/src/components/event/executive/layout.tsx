import {
  useDisclosure,
  IconButton,
  useBreakpointValue,
  UseDisclosureReturn,
  Box,
} from "@chakra-ui/react";
import { Layout as SharedLayout } from "@components/shared/layout";
import { useQuery } from "@hooks/useQuery";
import { Session } from "next-auth";
import { EventProvider, EventTabs, useEvent } from "./context";
import { Event } from "@prisma/client";
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
import { TooltipButton } from "src/ui/tooltip-button";
import { useRouter } from "next/router";
import { BsPlusLg } from "react-icons/bs";
import { TabButtons } from "@components/shared/tab-buttons";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDrag } from "@use-gesture/react";
import { useRef } from "react";

interface EventProps {
  session: Session;
  slug: string;
  fallback: Event;
  taskCreate?: UseDisclosureReturn;
  linkCreate?: UseDisclosureReturn;
}

const Nav: React.FC<{
  linkCreate: UseDisclosureReturn;
  taskCreate: UseDisclosureReturn;
  menuControl: UseDisclosureReturn;
}> = ({ linkCreate, taskCreate, menuControl }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();
  const { event } = useEvent();

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
              aria-label={`Create New`}
              onClick={
                EventTabs.LINKS.isSelected(router.asPath)
                  ? linkCreate?.onOpen
                  : taskCreate.onOpen
              }
            />
            <NavMenu tabs={EventTabs} control={menuControl} />
          </TopbarRight>
        </Topbar>
      ) : (
        <Sidebar>
          <SidebarTop />
          <SidebarCenter>
            <TabButtons tabs={EventTabs} />
          </SidebarCenter>
          <SidebarBottom>
            <TooltipButton
              label={`Create New`}
              placement="right"
              variant="ghost"
              icon={<BsPlusLg />}
              onClick={
                EventTabs.LINKS.isSelected(router.asPath)
                  ? linkCreate?.onOpen
                  : taskCreate.onOpen
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
            >
              {(onOpen) => (
                <TooltipButton
                  onClick={onOpen}
                  label={`Delete ${event.name}`}
                  variant="ghost"
                  _hover={{ bgColor: "red.400" }}
                  icon={<DeleteIcon />}
                  placement="right"
                />
              )}
            </DeleteItem>
          </SidebarBottom>
        </Sidebar>
      )}
    </>
  );
};

export const Layout: React.FC<EventProps> = ({
  slug,
  fallback,
  children,
  linkCreate,
  taskCreate,
}) => {
  const { data: event } = useQuery<Event>(`/events/${slug}`, {
    fallbackData: fallback,
  });
  const menuControl = useDisclosure();
  const ref = useRef<HTMLDivElement>();
  const bind: any = useDrag(
    ({ direction, distance, elapsedTime, ...state }) => {
      if (
        elapsedTime < 15 ||
        distance[0] < 8 ||
        state.event.type !== "touchend"
      )
        return;

      if (menuControl.isOpen && direction[0] === 1) {
        menuControl.onClose();
      } else if (!menuControl.isOpen && direction[0] === -1) {
        menuControl.onOpen();
      }
    },
    { axis: "x", pointer: { touch: true } },
  );

  return (
    <EventProvider event={event}>
      <Box {...bind()} ref={ref}>
        <SharedLayout title={event && event.name}>
          <Nav
            linkCreate={linkCreate}
            taskCreate={taskCreate}
            menuControl={menuControl}
          />
          {children}
        </SharedLayout>
      </Box>
    </EventProvider>
  );
};
