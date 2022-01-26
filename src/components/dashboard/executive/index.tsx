import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { TabButtons } from "@components/dashboard/executive/tabs-buttons";
import {
  Sidebar,
  SidebarBottom,
  SidebarCenter,
  SidebarTop,
  Topbar,
} from "@components/nav/base-sidebar";
import { NavMenu } from "@components/nav/menu";
import { SearchForm } from "@components/shared-search-form";
import { Layout } from "@components/shared/layout";
import { SVGLink } from "@components/shared/svg-link";
import { BsArrowLeft } from "react-icons/bs";
import { DashboardProvider, DashboardTabs, useDashboard } from "./context";
// import Layout from "./layout";
import Tabs from "./tabs";

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

export const ExecutiveDashboardView = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <DashboardProvider>
      <Layout title="Dashboard">
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
        <Tabs />
      </Layout>
    </DashboardProvider>
  );
};
