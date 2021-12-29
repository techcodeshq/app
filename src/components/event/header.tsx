import { SearchIcon } from "@chakra-ui/icons";
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
import { Event } from "@typings/event";
import { signOut } from "next-auth/react";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
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
              {event.name} • {selectedTab}
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

const EventHeader: React.FC = () => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { event, setSelectedTab, selectedTab } = useEvent();

  return (
    <Box width="100%" bgColor={bgColor}>
      <Flex
        width="95%"
        margin="0 auto"
        alignItems="center"
        justifyContent="space-between"
        h="4rem"
      >
        {isMobile && <MobileView />}
        {!isMobile && (
          <>
            <Flex>
              <SVGLink to="/dashboard?tab=Events" src="/logo.svg" alt="Logo" />
              <Heading fontWeight={600} fontSize="2rem" ml="1rem">
                {event.name} • {selectedTab}
              </Heading>
            </Flex>
            <Flex>
              {Object.values(EventTabs).map((value) => (
                <Button
                  key={value}
                  m="0 0.5rem"
                  height="4rem"
                  onClick={() => setSelectedTab(value)}
                  variant="ghost"
                  borderBottomRadius="0"
                  borderBottom={value === selectedTab ? "0.2rem solid" : null}
                  borderBottomColor={
                    value === selectedTab ? "accent.300" : null
                  }
                >
                  {value}
                </Button>
              ))}
            </Flex>
            <IconButton
              width="2.5rem"
              height="2.5rem"
              icon={<FiLogOut />}
              aria-label="log out"
              onClick={() => signOut()}
            />
          </>
        )}
      </Flex>
    </Box>
  );
};

export default EventHeader;
