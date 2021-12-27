import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  Grid,
  GridItem,
  Divider,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import { TabHeading } from "./member-heading";
import { MembersGrid } from "./members-grid";

interface MembersTabProps {}

export const MembersTab: React.FC<MembersTabProps> = ({}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex width="100%" flexDirection="column" height="100%">
      {!isMobile && <TabHeading />}
      <MembersGrid />
    </Flex>
  );
};
