import {
  Button,
  Divider,
  Flex,
  Heading,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Layout } from "@components/layout";
import { useMutation } from "@hooks/useMutation";
import { EventLink, LinkApplyInstructions } from "@prisma/client";
import {
  Sidebar,
  SidebarBottom,
  SidebarTop,
  Topbar,
  TopbarLeft,
  TopbarRight,
} from "@ui/sidebar";
import { TooltipButton } from "@ui/tooltip-button";
import React from "react";
import { ImQrcode } from "react-icons/im";
import { LinkData } from "./link-data";
import { LinkDataMobile } from "./link-data-mobile";
import { QRModal } from "./qr-modal";

interface LinkPageProps {
  link: EventLink & { metadata: LinkApplyInstructions[] };
}

export const LinkDashboard: React.FC<LinkPageProps> = ({ link }) => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const toggle = useMutation<EventLink, { id: String; value: boolean }>(
    "/links",
    "patch",
    `/links/code/${link.code}`,
  );
  const bgColor = useColorModeValue("bg.100", "bg.700");
  const qrControl = useDisclosure();

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
        <Heading fontWeight="550">{link.name}</Heading>
        <Flex gap="1rem">
          <TooltipButton
            label="View QR Code"
            onClick={qrControl.onOpen}
            icon={<ImQrcode />}
            variant="outline"
          />
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
      </Flex>
      {isMobile && <Divider mt="1rem" />}
      {isMobile ? <LinkDataMobile link={link} /> : <LinkData link={link} />}
      <QRModal link={link} control={qrControl} />
    </Layout>
  );
};
