import { Box, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import React from "react";
import { useEvent } from "../event/pages/context";
import { LinkCard } from "./card";
import { QueryLink } from "./query";

export const LinksGrid: React.FC = () => {
  const { event } = useEvent();
  const { data } = useQuery<QueryLink[]>(`/links/${event.id}`);

  return (
    <Box overflowY="auto" overflowX="hidden" h="100%">
      <SimpleGrid columns={{ base: 1, lg: 3, xl: 4 }} gap="2rem" mt="1rem">
        {data && data.map((link) => <LinkCard link={link} />)}
      </SimpleGrid>
    </Box>
  );
};
