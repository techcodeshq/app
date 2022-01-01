import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useEvent } from "./context";
import { CreateLink } from "./create-link";
import EventHeader from "./header";
import { LinksGrid } from "./links-grid";

interface LinksTabProps {}

export const LinksTab: React.FC<LinksTabProps> = ({}) => {
  const { event, selectedTab } = useEvent();
  const { onOpen, isOpen, onClose } = useDisclosure();

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.altKey && event.key === "n") {
        event.preventDefault();
        onOpen();
      }
    });
  }, []);

  return (
    <>
      <EventHeader onOpen={onOpen} />
      <Box m={{ base: "6rem 2rem", md: "6rem 8rem" }}>
        <LinksGrid />
      </Box>
      <CreateLink isOpen={isOpen} onClose={onClose} />
    </>
  );
};
