import {
  Box,
  Divider,
  Grid,
  GridItem,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { useAxios } from "@lib/axios";
import { EventLink, LinkApplyInstructions, User } from "@typings";
import config from "next/config";
import React from "react";
import useSWR from "swr";
import { useEvent } from "./context";
import { LinksRow } from "./link-row";

export type LinkWithMetadata = EventLink & {
  metadata: LinkApplyInstructions[];
};

export const LinksGrid: React.FC = () => {
  const boxColor = useColorModeValue("bg.100", "bg.800");
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const { searchFilter, event } = useEvent();
  const { data } = useQuery<LinkWithMetadata[]>(`/links/${event.id}`);

  return (
    <Box
      m={{ base: "2rem", lg: "2rem 8rem" }}
      bgColor={boxColor}
      borderRadius="0.4rem"
      overflow="auto"
    >
      <Grid
        templateColumns={mobileGrid ? "1fr 1fr 1fr" : "repate(4, 1fr)"}
        gap="2rem"
        padding="1.5rem"
        fontWeight="bold"
      >
        <GridItem>Name</GridItem>
        <GridItem>Uses</GridItem>
        <GridItem>Enabled</GridItem>
        <GridItem>Actions</GridItem>
        {data &&
          data.filter(searchFilter).map((link) => (
            <React.Fragment key={link.id}>
              <LinksRow link={link} />
              <GridItem colSpan={mobileGrid ? 3 : 4}>
                <Divider />
              </GridItem>
            </React.Fragment>
          ))}
      </Grid>
    </Box>
  );
};
