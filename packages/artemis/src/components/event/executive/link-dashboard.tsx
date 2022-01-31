import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  GridItem,
  Heading,
  HStack,
  Image,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Sidebar,
  SidebarBottom,
  SidebarTop,
  Topbar,
  TopbarLeft,
  TopbarRight,
} from "@components/nav/base-sidebar";
import { DeleteItem } from "@components/shared/delete-item";
import { Layout } from "@components/shared/layout";
import { Grid } from "@components/ui/grid";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import {
  EventLink,
  EventLinkRedeem,
  LinkApplyInstructions,
} from "@prisma/client";
import Link from "next/link";
import QRCode from "qrcode.react";
import React from "react";
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
    md: false,
  });
  const { data } = useQuery<Response>(`/links/redeemed/${link.id}`, {
    refreshInterval: 1000,
  });
  const toggle = useMutation<EventLink, { id: String; value: boolean }>(
    "/links",
    "patch",
    `/links/code/${link.code}`,
  );
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const qrSize = useBreakpointValue({ base: 200, lg: 250 });

  return (
    <Layout title="Link">
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
      <Flex alignItems="center" justifyContent="space-between">
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
        pt="2rem"
        gap="2rem"
        h="100%"
        width={{ base: null, md: "100%" }}
        overflow="auto"
        flexDirection={{ base: "column", md: "row" }}
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
            width={{ base: "100%", md: null }}
            overflow="auto"
            id="redeemed"
          >
            <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
              Redeemed
            </Heading>
            <Grid
              templateColumns={{
                base: "repeat(4, 1fr)",
                md: "repeat(5, 1fr)",
              }}
            >
              {!isMobile && <GridItem fontWeight="600">Avatar</GridItem>}
              <GridItem fontWeight="600">Name</GridItem>
              <GridItem fontWeight="600">Status</GridItem>
              <GridItem fontWeight="600">Time</GridItem>
              <GridItem fontWeight="600" />
              {data &&
                data.map((item) => (
                  <React.Fragment key={item.user.id}>
                    {!isMobile && (
                      <GridItem alignSelf="center">
                        <Avatar
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
                    <GridItem>
                      <DeleteItem
                        url={`/links/redeem/${link.id}/${item.userId}`}
                        refetchUrl={`/links/redeemed/${link.id}`}
                        itemName={item.user.name}
                        warningText="Are you sure you would like to undo the redeem for this user? This should not be done if the redeem was successful!"
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 4, md: 5 }}>
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
            width={{ base: "100%", md: null }}
            id="qr"
          >
            <Flex justifyContent="space-between" p="1.5rem" fontSize="1.5rem">
              <Heading>QRCode</Heading>
              <Heading>{link.code}</Heading>
            </Flex>
            <Center>
              <QRCode value={fullUrl || window?.location?.href} size={qrSize} />
            </Center>
          </Flex>
          <Flex
            flexDir="column"
            flex="1"
            bgColor={boxColor}
            borderRadius="0.4rem"
            overflow="auto"
            width={{ base: "100%", md: null }}
            id="actions"
          >
            <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
              Actions
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)">
              <GridItem>Key</GridItem>
              <GridItem>Value</GridItem>
              {link.metadata &&
                link.metadata.map((md) => <LinkActions metadata={md} />)}
            </Grid>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};
