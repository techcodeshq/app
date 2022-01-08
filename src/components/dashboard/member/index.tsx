import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  HorizontalSidebar,
  VerticalSidebar,
} from "@components/nav/base-sidebar";
import { useQuery } from "@hooks/useQuery";
import { KeyValueAction, UserMetadata } from "@typings";
import { actionBasedValue } from "@lib/util/actionBasedValue";
import React from "react";

type Return = {
  metadata: UserMetadata[] | undefined;
  links:
    | {
        createdAt: string;
        eventLink: {
          metadata: {
            value: number;
            action: KeyValueAction;
            key: string;
            eventLink: {
              name: string;
            };
          }[];
        };
      }[]
    | undefined;
};

export const MemberDashboardView: React.FC<{ route: string }> = ({ route }) => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const boxColor = useColorModeValue("bg.100", "bg.800");
  const { data } = useQuery<Return>(route);

  return (
    <Flex flexDirection={{ base: "column", md: "row" }} h="100vh">
      {isMobile ? <HorizontalSidebar /> : <VerticalSidebar />}
      <Flex
        p="2rem"
        gap="2rem"
        width={{ base: null, md: "100%" }}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Flex flex="0.5">
          <Box
            bgColor={boxColor}
            borderRadius="0.4rem"
            width={{ base: "100%", md: null }}
            overflow="auto"
            minH="100%"
          >
            <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
              Statistics
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap="2rem" padding="1.5rem">
              <GridItem fontWeight="600">Key</GridItem>
              <GridItem fontWeight="600">Value</GridItem>
              {data &&
                data.metadata.map((md) => (
                  <React.Fragment key={md.key}>
                    <GridItem>{md.key}</GridItem>
                    <GridItem>{md.value}</GridItem>
                    <GridItem colSpan={2}>
                      <Divider />
                    </GridItem>
                  </React.Fragment>
                ))}
            </Grid>
          </Box>
        </Flex>
        <Flex flex="1">
          <Box
            bgColor={boxColor}
            borderRadius="0.4rem"
            overflow="auto"
            minH="100%"
            width={{ base: "100%", md: null }}
          >
            <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
              History
            </Heading>
            <Grid templateColumns="repeat(4, 1fr)" p="1.5rem" gap="2rem">
              <GridItem fontWeight="600">Link</GridItem>
              <GridItem fontWeight="600">Key</GridItem>
              <GridItem fontWeight="600">Value</GridItem>
              <GridItem fontWeight="600">Redeemed On</GridItem>
              {data &&
                data.links.map((link) =>
                  link.eventLink.metadata.map((m, index) => (
                    <React.Fragment key={index}>
                      <GridItem
                        color={actionBasedValue(m.action, [
                          "green.200",
                          "red.300",
                          "white",
                        ])}
                      >
                        {m.eventLink.name}
                      </GridItem>
                      <GridItem
                        color={actionBasedValue(m.action, [
                          "green.200",
                          "red.300",
                          "white",
                        ])}
                      >
                        {m.key}
                      </GridItem>
                      <GridItem
                        color={actionBasedValue(m.action, [
                          "green.200",
                          "red.300",
                          "white",
                        ])}
                      >
                        {actionBasedValue(m.action, ["+", "-", "="])}
                        {m.value}
                      </GridItem>
                      <GridItem
                        color={actionBasedValue(m.action, [
                          "green.200",
                          "red.300",
                          "white",
                        ])}
                      >
                        {new Date(link.createdAt).toLocaleDateString() +
                          " at " +
                          new Date(link.createdAt).toLocaleTimeString()}
                      </GridItem>
                      <GridItem colSpan={4}>
                        <Divider />
                      </GridItem>
                    </React.Fragment>
                  ))
                )}
            </Grid>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
