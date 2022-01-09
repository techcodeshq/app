import {
  Box,
  Center,
  Divider,
  GridItem,
  Heading,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Grid } from "@components/ui/grid";
import { useQuery } from "@hooks/useQuery";
import { useAxios } from "@lib/axios";
import { EventLink, LinkApplyInstructions, User } from "@typings";
import config from "next/config";
import React from "react";
import useSWR from "swr";
import { useEvent } from "../../context";
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
    <>
      {!data ||
        (data.length === 0 && (
          <Center height="100%">
            <Heading color="gray.600" p="10rem 0rem">
              This event has no links!
            </Heading>
          </Center>
        ))}
      {data && data.length > 0 && (
        <Box bgColor={boxColor} borderRadius="0.4rem" overflow="auto">
          <Grid
            templateColumns={mobileGrid ? "repeat(4, 1fr)" : "repeat(5, 1fr)"}
          >
            <GridItem>Name</GridItem>
            <GridItem>Uses</GridItem>
            {!mobileGrid && <GridItem>Enabled</GridItem>}
            <GridItem>Details</GridItem>
            <GridItem>Grant</GridItem>
            {data.filter(searchFilter).map((link) => (
              <React.Fragment key={link.id}>
                <LinksRow link={link} />
                <GridItem colSpan={mobileGrid ? 4 : 5}>
                  <Divider />
                </GridItem>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
};
