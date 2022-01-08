import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  useBreakpointValue,
  useColorModeValue,
  Image,
  Center,
} from "@chakra-ui/react";
import { MemberRow } from "@components/dashboard/executive/members-tab/member-row";
import {
  HorizontalSidebar,
  VerticalSidebar,
} from "@components/nav/base-sidebar";
import { useQuery } from "@hooks/useQuery";
import {
  EventLink,
  EventLinkRedeem,
  EventLinkRedeemStatus,
  LinkApplyInstructions,
} from "@typings";
import React from "react";
import QRCode from "qrcode.react";

interface LinkPageProps {
  link: EventLink & { metadata: LinkApplyInstructions[] };
  fullUrl: string;
}

type Response = (EventLinkRedeem & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
})[];

export const LinkDashboard: React.FC<LinkPageProps> = ({ link, fullUrl }) => {
  const boxColor = useColorModeValue("bg.100", "bg.800");
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const { data } = useQuery<Response>(`/links/redeemed/${link.id}`, {
    refreshInterval: 1000,
  });

  return (
    <Flex flexDirection={{ base: "column", md: "row" }} h="100vh">
      {isMobile ? <HorizontalSidebar /> : <VerticalSidebar />}
      <Flex w="100%" flexDir="column" flex="1">
        <Heading p="2rem 2rem 0">
          <Box as="span" fontWeight="650">
            Link:
          </Box>{" "}
          <Box as="span" fontWeight="500">
            {link.name}
          </Box>
        </Heading>
        <Flex
          p="2rem"
          gap="2rem"
          h="100%"
          width={{ base: null, md: "100%" }}
          overflow="auto"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Flex flex="2">
            <Box
              bgColor={boxColor}
              borderRadius="0.4rem"
              width={{ base: "100%", md: null }}
              overflow="auto"
            >
              <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
                Redeemed
              </Heading>
              <Grid templateColumns="repeat(4, 1fr)" p="1.5rem" gap="2rem">
                <GridItem fontWeight="600">Avatar</GridItem>
                <GridItem fontWeight="600">Name</GridItem>
                <GridItem fontWeight="600">Status</GridItem>
                <GridItem fontWeight="600">Redeemed On</GridItem>
                {data &&
                  data.map((item) => (
                    <React.Fragment key={item.user.id}>
                      <GridItem alignSelf="center">
                        <Image
                          width="3rem"
                          borderRadius="50%"
                          alt={`${item.user.name}-avatar`}
                          src={item.user.image}
                        />
                      </GridItem>
                      <GridItem alignSelf="center">{item.user.name}</GridItem>
                      <GridItem alignSelf="center">
                        {item.statusDescription}
                      </GridItem>
                      <GridItem alignSelf="center">
                        {new Date(item.createdAt).toLocaleDateString() +
                          " at " +
                          new Date(item.createdAt).toLocaleTimeString()}
                      </GridItem>
                    </React.Fragment>
                  ))}
              </Grid>
            </Box>
          </Flex>
          <Flex flex="1.5" flexDir="column" gap="2rem">
            <Flex
              bgColor={boxColor}
              flex="1"
              flexDir="column"
              borderRadius="0.4rem"
              overflow="auto"
              width={{ base: "100%", md: null }}
            >
              <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
                QRCode
              </Heading>
              <Center>
                <QRCode
                  value={fullUrl || window?.location?.href}
                  size={300}
                  bgColor="#0C121A"
                  fgColor="white"
                />
              </Center>
            </Flex>
            <Flex
              flexDir="column"
              flex="1"
              bgColor={boxColor}
              borderRadius="0.4rem"
              overflow="auto"
              width={{ base: "100%", md: null }}
            >
              <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
                Actions
              </Heading>
              <Grid templateColumns="repeat(3, 1fr)" p="1.5rem" gap="2rem">
                <GridItem>Key</GridItem>
                <GridItem>Action</GridItem>
                <GridItem>Value</GridItem>
                {link.metadata &&
                  link.metadata.map((md) => (
                    <React.Fragment key={md.key}>
                      <GridItem
                        color={
                          md.action === "INCREMENT"
                            ? "green.300"
                            : md.action === "DECREMENT"
                            ? "red.300"
                            : "white"
                        }
                      >
                        {md.key}
                      </GridItem>
                      <GridItem
                        color={
                          md.action === "INCREMENT"
                            ? "green.300"
                            : md.action === "DECREMENT"
                            ? "red.300"
                            : "white"
                        }
                      >
                        {md.action}
                      </GridItem>
                      <GridItem
                        color={
                          md.action === "INCREMENT"
                            ? "green.300"
                            : md.action === "DECREMENT"
                            ? "red.300"
                            : "white"
                        }
                      >
                        {md.value}
                      </GridItem>
                      <GridItem colSpan={3}>
                        <Divider />
                      </GridItem>
                    </React.Fragment>
                  ))}
              </Grid>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
