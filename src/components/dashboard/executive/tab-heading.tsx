import { Flex, Heading } from "@chakra-ui/react";
import { SearchForm } from "@components/shared-search-form";
import React from "react";
import { useDashboard } from "./context";

export const TabHeading: React.FC<{ heading: string }> = ({ heading }) => {
  const { setSearchFilter } = useDashboard();

  return (
    <Flex width="100%" justifyContent="space-between">
      <Heading fontWeight="600">{heading}</Heading>
      <SearchForm setSearchFilter={setSearchFilter} />
    </Flex>
  );
};
