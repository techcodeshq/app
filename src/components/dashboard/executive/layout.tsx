import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
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
import { SVGLink } from "@components/shared/svg-link";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Layout as SharedLayout } from "@components/shared/layout";
// import { Sidebar } from "../../nav/sidebar";
import { DashboardProvider, DashboardTabs, useDashboard } from "./context";
import { TabButtons } from "@components/shared/tab-buttons";
import { TabHeading } from "./tab-heading";

interface LayoutProps {
  tab: string;
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

const Layout: React.FC<LayoutProps> = ({ children, tab }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

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
            <SidebarBottom />
          </Sidebar>
        )}
        <TabHeading heading={tab} />
        {children}
      </SharedLayout>
    </DashboardProvider>
  );
};

export default Layout;
