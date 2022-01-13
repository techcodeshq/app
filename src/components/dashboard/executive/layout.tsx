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
  Topbar,
  SidebarBottom,
  SidebarCenter,
  SidebarTop,
  Sidebar,
  TopbarLeft,
  TopbarRight,
} from "@components/nav/base-sidebar";
import { NavMenu } from "@components/nav/menu";
import { TabButtons } from "@components/dashboard/executive/tabs-buttons";
import { SearchForm } from "@components/shared-search-form";
import { SVGLink } from "@components/shared/svg-link";
import Head from "next/head";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
// import { Sidebar } from "../../nav/sidebar";
import { DashboardTabs, useDashboard } from "./context";

interface LayoutProps {}

const MobileView = () => {
  const { selectedTab, setSelectedTab, setSearchFilter } = useDashboard();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {!isOpen ? (
        <>
          <Flex alignItems="center">
            <SVGLink to="/dashboard" src="/logo.svg" alt="Logo" />
            <Heading fontWeight="600" fontSize="1.5rem" ml="1rem">
              {selectedTab}
            </Heading>
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
            <NavMenu setSelectedTab={setSelectedTab} tabs={DashboardTabs} />
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

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { selectedTab } = useDashboard();

  return (
    <>
      <Head>
        <title>{selectedTab} | TechCodes</title>
      </Head>
      <Flex flexDirection={{ base: "column", md: "row" }} height="100vh">
        {isMobile ? (
          <Topbar>
            <MobileView />
          </Topbar>
        ) : (
          <Sidebar>
            <SidebarTop />
            <SidebarCenter>
              <TabButtons />
            </SidebarCenter>
            <SidebarBottom />
          </Sidebar>
        )}
        {/* <Sidebar /> */}
        {children}
      </Flex>
    </>
  );
};

export default Layout;
