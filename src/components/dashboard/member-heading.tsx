import { SearchIcon } from "@chakra-ui/icons";
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
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { MembersGrid } from "./members-grid";

interface MemberHeadingProps {}

export const MemberHeading: React.FC<MemberHeadingProps> = ({}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const inputColor = useColorModeValue("bg.100", "bg.800");
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex width="100%" justifyContent="space-between">
      <Heading fontWeight="600">Members</Heading>
      <Flex width="clamp(30%, 30vmax, 35rem)">
        <Input
          variant="filled"
          borderRightRadius={0}
          bgColor={inputColor}
          placeholder="Name"
        />
        {!isMobile && <Button borderLeftRadius={0}>Search</Button>}
        {isMobile && <IconButton icon={<SearchIcon />} aria-label="search" />}
      </Flex>
    </Flex>
  );
};
