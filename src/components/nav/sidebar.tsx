import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { DashboardTabs, useDashboard } from "../dashboard/context";
import { SearchForm } from "../shared-search-form";
import { NavMenu } from "./menu";
import { TabButtons } from "./tabs-buttons";

export const SVGLink: React.FC<{
  to: string;
  src: string;
  alt: string;
  newTab?: boolean;
}> = ({ to, src, alt, newTab }) => (
  <Link href={to} target={newTab ? "_blank" : undefined}>
    <Image src={src} alt={alt} w="2.5rem" h="2.5rem" />
  </Link>
);

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

const DesktopView = () => (
  <>
    <Flex alignItems="center">
      <SVGLink to="/dashboard" src="/logo.svg" alt="Logo" />
    </Flex>
    <TabButtons />
    <Tooltip label="Sign Out" placement="right">
      <IconButton
        width="2.5rem"
        height="2.5rem"
        icon={<FiLogOut />}
        aria-label="log out"
        onClick={() => signOut()}
      />
    </Tooltip>
  </>
);

export const Sidebar: React.FC = () => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const borderColor = useColorModeValue("bg.200", "bg.700");
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w={{ base: "100%", md: "4rem" }}
      h={{ base: "4rem", md: "100vh" }}
      position="fixed"
      top={0}
      zIndex={1}
      bgColor={bgColor}
      flexDirection={{ base: "row", md: "column" }}
      padding={{ base: "1.5rem", md: "2rem 0" }}
      border="0.1rem solid"
      borderColor={borderColor}
    >
      {isMobile ? <MobileView /> : <DesktopView />}
    </Flex>
  );
};
