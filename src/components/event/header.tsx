import { PlusSquareIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { DashboardTabs } from "@components/dashboard/context";
import { NavMenu } from "@components/nav/menu";
import { SVGLink } from "@components/nav/sidebar";
import { SearchForm } from "@components/shared-search-form";
import { Event } from "@typings";
import { signOut } from "next-auth/react";
import React from "react";
import { BsArrowLeft, BsPlus, BsPlusLg } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { EventTabs, useEvent } from "./context";

const MobileView = () => {
  const { event, selectedTab, setSelectedTab, setSearchFilter } = useEvent();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {!isOpen ? (
        <>
          <Flex alignItems="center">
            <SVGLink to="/dashboard?tab=Events" src="/logo.svg" alt="Logo" />
            <Heading fontWeight="600" fontSize="1.5rem" ml="1rem">
              {event.name}
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
            <NavMenu setSelectedTab={setSelectedTab} tabs={EventTabs} />
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

const EventHeader: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const borderBottom = useColorModeValue("bg.200", "black");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { event, setSelectedTab, selectedTab } = useEvent();

  return (
    <Box width="100%" bgColor={bgColor}>
      <Flex
        p={{ base: "0 2rem", md: "0 4rem" }}
        alignItems="center"
        justifyContent="space-between"
        h="4rem"
        borderBottom="2px solid"
        borderBottomColor={borderBottom}
      >
        {isMobile && <MobileView />}
        {!isMobile && (
          <>
            <Flex
              width="50%"
              height="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <SVGLink to="/dashboard?tab=Events" src="/logo.svg" alt="Logo" />
              <Heading
                fontWeight={600}
                fontSize="2rem"
                ml="4rem"
                position="absolute"
              >
                {event.name}
              </Heading>
              <Button
                m="0 0.5rem"
                height="4rem"
                onClick={() => setSelectedTab(EventTabs.TASKS)}
                variant="ghost"
                borderBottomRadius="0"
                borderBottom={
                  EventTabs.TASKS === selectedTab ? "0.2rem solid" : null
                }
                borderBottomColor={
                  EventTabs.TASKS === selectedTab ? "accent.300" : null
                }
              >
                {EventTabs.TASKS}
              </Button>
            </Flex>
            <Flex width="50%" height="100%" justifyContent="space-between">
              <Button
                m="0 0.5rem"
                height="4rem"
                onClick={() => setSelectedTab(EventTabs.LINKS)}
                variant="ghost"
                borderBottomRadius="0"
                borderBottom={
                  EventTabs.LINKS === selectedTab ? "0.2rem solid" : null
                }
                borderBottomColor={
                  EventTabs.LINKS === selectedTab ? "accent.300" : null
                }
              >
                {EventTabs.LINKS}
              </Button>
              <HStack>
                <IconButton
                  variant="ghost"
                  width="2.5rem"
                  height="2.5rem"
                  icon={<BsPlusLg />}
                  aria-label={`create ${selectedTab}`}
                  onClick={onOpen}
                />
                <IconButton
                  width="2.5rem"
                  height="2.5rem"
                  icon={<FiLogOut />}
                  aria-label="log out"
                  onClick={() => signOut()}
                />
              </HStack>
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default EventHeader;
