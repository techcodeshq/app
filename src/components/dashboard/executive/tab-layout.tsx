import { Flex, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { TabHeading } from "./tab-heading";

export const TabLayout: React.FC = ({ children }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex width="100%" flexDirection="column" height="100%">
      {!isMobile && <TabHeading />}
      {children}
    </Flex>
  );
};
