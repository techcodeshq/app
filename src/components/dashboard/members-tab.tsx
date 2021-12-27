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
} from "@chakra-ui/react";
import React from "react";
import { MemberHeading } from "./member-heading";
import { MembersGrid } from "./members-grid";

interface MembersTabProps {}

export const MembersTab: React.FC<MembersTabProps> = ({}) => {
  return (
    <Flex width="100%" flexDirection="column" height="100%">
      <MemberHeading />
      <MembersGrid />
    </Flex>
  );
};
