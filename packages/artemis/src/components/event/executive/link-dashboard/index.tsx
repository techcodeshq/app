import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
import { Layout } from "@components/shared/layout";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import {
  EventLink,
  EventLinkRedeem,
  LinkApplyInstructions,
} from "@prisma/client";
import Link from "next/link";
import React from "react";
import { LinkActions } from "../../link-actions";
import { LinkData } from "./link-data";
import { LinkDataMobile } from "./link-data-mobile";
import { LinkRedeemRow } from "./redeem-row";

interface LinkPageProps {
  link: EventLink & { metadata: LinkApplyInstructions[] };
  fullUrl: string;
}

export const LinkDashboard: React.FC<LinkPageProps> = ({ link, fullUrl }) => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const toggle = useMutation<EventLink, { id: String; value: boolean }>(
    "/links",
    "patch",
    `/links/code/${link.code}`,
  );
  const bgColor = useColorModeValue("bg.100", "bg.800");

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
      {isMobile && <Divider mt="1rem" />}
      {isMobile ? (
        <LinkDataMobile link={link} fullUrl={fullUrl} />
      ) : (
        <LinkData link={link} fullUrl={fullUrl} />
      )}
    </Layout>
  );
};
