import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Topbar,
  Sidebar,
  SidebarBottom,
  SidebarTop,
  TopbarLeft,
  TopbarRight,
} from "@components/nav/base-sidebar";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import { EventLink, EventLinkRedeem, LinkApplyInstructions } from "@typings";
import { actionBasedValue } from "@lib/util/actionBasedValue";
import QRCode from "qrcode.react";
import React from "react";
import Link from "next/link";
import { LinkActions } from "../link-actions";

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
    lg: false,
  });
  const { data } = useQuery<Response>(`/links/redeemed/${link.id}`, {
    refreshInterval: 1000,
  });
  const toggle = useMutation<EventLink, { id: String; value: boolean }>(
    "/links",
    "patch",
    `/links/code/${link.code}`
  );
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const qrSize = useBreakpointValue({ base: 200, lg: 250 });

  return (
    <Flex flexDirection={{ base: "column", lg: "row" }} h="100vh">
      {isMobile ? (
        <Topbar>
          <TopbarLeft />
          <TopbarRight />
        </Topbar>
      ) : (
        <Sidebar>
          <SidebarTop />
          <SidebarBottom />
        </Sidebar>
      )}
      <Flex
        w="100%"
        flexDir="column"
        flex="1"
        m={{ base: "2.5rem auto auto", lg: "0 2rem 0 6rem" }}
      >
        <Flex
          alignItems="center"
          p="2rem 2rem 0"
          justifyContent="space-between"
        >
          <Heading>
            <Box as="span" fontWeight="650">
              Link:
            </Box>{" "}
            <Box as="span" fontWeight="500">
              {link.name}
            </Box>
          </Heading>
          <Button
            onClick={async () => {
              await toggle({
                id: link.id,
                value: !link.enabled,
              });
            }}
            bgColor={link.enabled ? "green.300" : "red.300"}
            _hover={{
              bgColor: link.enabled ? "green.400" : "red.500",
              transition: "background-color ease-in 200ms",
            }}
            color={bgColor}
          >
            {link.enabled ? "Disable" : "Enable"}
          </Button>
        </Flex>
        <Flex
          p="2rem"
          gap="2rem"
          h="100%"
          width={{ base: null, lg: "100%" }}
          overflow="auto"
          flexDirection={{ base: "column", lg: "row" }}
        >
          {isMobile && (
            <HStack>
              <Link href="#redeemed">Redeemed</Link>
              <Link href="#qr">QR Code</Link>
              <Link href="#actions">Actions</Link>
            </HStack>
          )}
          <Flex flex="2">
            <Box
              bgColor={boxColor}
              borderRadius="0.4rem"
              width={{ base: "100%", lg: null }}
              overflow="auto"
              id="redeemed"
            >
              <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
                Redeemed
              </Heading>
              <Grid templateColumns="repeat(4, 1fr)" p="1.5rem" gap="2rem">
                {!isMobile && <GridItem fontWeight="600">Avatar</GridItem>}
                <GridItem fontWeight="600">Name</GridItem>
                <GridItem fontWeight="600">Status</GridItem>
                <GridItem fontWeight="600">Time</GridItem>
                {data &&
                  data.map((item) => (
                    <React.Fragment key={item.user.id}>
                      {!isMobile && (
                        <GridItem alignSelf="center">
                          <Image
                            width="3rem"
                            borderRadius="50%"
                            alt={`${item.user.name}-avatar`}
                            src={item.user.image}
                          />
                        </GridItem>
                      )}
                      <GridItem alignSelf="center">
                        <Link href={`/user/${item.user.id}`}>
                          {item.user.name}
                        </Link>
                      </GridItem>
                      <GridItem alignSelf="center">
                        {item.statusDescription}
                      </GridItem>
                      <GridItem alignSelf="center">
                        {new Date(item.createdAt).toLocaleDateString() +
                          " at " +
                          new Date(item.createdAt).toLocaleTimeString()}
                      </GridItem>
                      <GridItem colSpan={4}>
                        <Divider />
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
              width={{ base: "100%", lg: null }}
              id="qr"
            >
              <Flex justifyContent="space-between" p="1.5rem" fontSize="1.5rem">
                <Heading>QRCode</Heading>
                <Heading>{link.code}</Heading>
              </Flex>
              <Center>
                <QRCode
                  value={fullUrl || window?.location?.href}
                  size={qrSize}
                />
              </Center>
            </Flex>
            <Flex
              flexDir="column"
              flex="1"
              bgColor={boxColor}
              borderRadius="0.4rem"
              overflow="auto"
              width={{ base: "100%", lg: null }}
              id="actions"
            >
              <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
                Actions
              </Heading>
              <Grid templateColumns="repeat(2, 1fr)" p="1.5rem" gap="2rem">
                <GridItem>Key</GridItem>
                <GridItem>Value</GridItem>
                {link.metadata &&
                  link.metadata.map((md) => <LinkActions metadata={md} />)}
              </Grid>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
