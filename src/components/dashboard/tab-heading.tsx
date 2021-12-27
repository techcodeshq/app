import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { SearchForm } from "../shared-search-form";
import { useDashboard } from "./context";

export const TabHeading: React.FC = ({}) => {
  const { selectedTab } = useDashboard();

  return (
    <Flex width="100%" justifyContent="space-between">
      <Heading fontWeight="600">{selectedTab}</Heading>
      <SearchForm />
    </Flex>
  );
};
