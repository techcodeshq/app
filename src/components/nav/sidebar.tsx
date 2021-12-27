import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  BsArrowLeft,
  BsFillCalendarEventFill,
  BsFillPersonLinesFill,
} from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useSearch } from "../../hooks/useSearch";
import { DashboardTabs, useDashboard } from "../dashboard/context";
import { SearchForm } from "../shared-search-form";
import { NavMenu } from "./menu";
import { TabButtons } from "./tabs-buttons";

const SVGLink: React.FC<{
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
  const { selectedTab } = useDashboard();
  const inputColor = useColorModeValue("bg.300", "bg.800");
  const borderColor = useColorModeValue("bg.200", "bg.700");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { search, setSearchTerm } = useSearch();

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
            <NavMenu />
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
          <SearchForm />
          {/* <Input
            variant="filled"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
            bgColor={inputColor}
            placeholder="Name"
            borderColor={borderColor}
          />
          <IconButton
            width="2.5rem"
            height="2.5rem"
            icon={<SearchIcon />}
            aria-label="log out"
            variant="outline"
            onClick={search}
          /> */}
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
    <IconButton
      width="2.5rem"
      height="2.5rem"
      icon={<FiLogOut />}
      aria-label="log out"
      onClick={() => signOut()}
    />
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
