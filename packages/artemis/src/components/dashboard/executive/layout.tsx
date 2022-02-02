import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import {
  Sidebar,
  SidebarBottom,
  SidebarCenter,
  SidebarTop,
  Topbar,
} from "@components/nav/base-sidebar";
import { NavMenu } from "@components/nav/menu";
import { SearchForm } from "@components/shared-search-form";
import { Layout as SharedLayout } from "@components/shared/layout";
import { SVGLink } from "@components/shared/svg-link";
import { TabButtons } from "@components/shared/tab-buttons";
import { TooltipButton } from "@components/ui/tooltip-button";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft, BsPlusLg } from "react-icons/bs";
import { DashboardProvider, DashboardTabs, useDashboard } from "./context";
import { TabHeading } from "./tab-heading";

interface LayoutProps {
  tab: string;
  eventCreate: UseDisclosureReturn;
}

const MobileView = () => {
  const { setSearchFilter } = useDashboard();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {!isOpen ? (
        <>
          <Flex alignItems="center">
            <SVGLink to="/dashboard" src="/logo.svg" alt="Logo" />
            <Heading fontWeight="600" fontSize="1.5rem" ml="1rem"></Heading>
          </Flex>
          <HStack spacing={4}>
            <IconButton
              width="2.5rem"
              height="2.5rem"
              icon={<SearchIcon />}
              aria-label="log out"
              variant="outline"
              onClick={onOpen}
            />
            <NavMenu tabs={DashboardTabs} />
          </HStack>
        </>
      ) : (
        <HStack width="100%">
          <IconButton
            width="2.5rem"
            height="2.5rem"
            icon={<BsArrowLeft />}
            aria-label="log out"
            variant="outline"
            onClick={onClose}
          />
          <SearchForm setSearchFilter={setSearchFilter} />
        </HStack>
      )}
    </>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, eventCreate, tab }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  return (
    <DashboardProvider>
      <SharedLayout title="Dashboard">
        {isMobile ? (
          <Topbar>
            <MobileView />
          </Topbar>
        ) : (
          <Sidebar>
            <SidebarTop />
            <SidebarCenter>
              <TabButtons tabs={DashboardTabs} />
            </SidebarCenter>
            <SidebarBottom>
              <TooltipButton
                label="Create Event"
                placement="right"
                variant="ghost"
                icon={<BsPlusLg />}
                onClick={
                  DashboardTabs.EVENTS.isSelected(router.asPath)
                    ? () => eventCreate.onOpen()
                    : null
                }
              />
            </SidebarBottom>
          </Sidebar>
        )}
        {!isMobile && <TabHeading heading={tab} />}
        {children}
      </SharedLayout>
    </DashboardProvider>
  );
};

export default Layout;
