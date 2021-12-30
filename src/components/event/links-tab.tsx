import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { useEvent } from "./context";
import { LinksGrid } from "./links-grid";

interface LinksTabProps {}

export const LinksTab: React.FC<LinksTabProps> = ({}) => {
  const { event, selectedTab } = useEvent();

  return (
    <Box>
      <LinksGrid />
    </Box>
  );
};
