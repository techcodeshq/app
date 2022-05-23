import {
  Center,
  Flex,
  Heading,
  Text,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  Box,
  Divider,
} from "@chakra-ui/react";
import { LinkActions } from "@modules/links/link-actions";
import { useQuery } from "@hooks/useQuery";
import {
  EventLink,
  EventLinkRedeem,
  KeyValueAction,
  LinkApplyInstructions,
} from "@prisma/client";
import QRCode from "qrcode.react";
// import { LinkRedeemRow } from "./redeem-row"; << needs to be un-member-ified
import { LinkRedeemCard } from "./redeem-card";
import { LinkActionCard } from "./action-card";

export type Response = EventLinkRedeem & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export const LinkData: React.FC<{
  link: EventLink & { metadata: LinkApplyInstructions[] };
}> = ({ link }) => {
  const boxColor = useColorModeValue("bg.100", "bg.700");
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const { data } = useQuery<Response[]>(`/links/redeemed/${link.id}`, {
    refreshInterval: 1000,
  });

  return (
    <Flex
      pt="2rem"
      gap="2rem"
      h="100%"
      width={{ base: null, md: "100%" }}
      overflow="auto"
      flexDirection={{ base: "column", md: "row" }}
    >
      <Flex flex="4">
        <Flex flexDir="column" width={{ base: "100%", md: null }}>
          <Heading fontSize="1.5rem" fontWeight="500">
            Redeemed
          </Heading>
          <Box
            overflow="auto"
            display="flex"
            gap="1rem"
            flexDir="column"
            p="0.5rem 0.5rem 0 0"
          >
            {data &&
              data.map((item) => (
                <LinkRedeemCard redeem={item} key={item.userId} />
              ))}
          </Box>
        </Flex>
      </Flex>
      <Divider orientation="vertical" />
      <Flex flex="1.5" flexDir="column">
        <Flex
          flexDir="column"
          gap="1rem"
          flex="1"
          overflow="auto"
          width={{ base: "100%", md: null }}
        >
          <Heading fontSize="1.5rem" fontWeight="500">
            Actions
          </Heading>
          {link.metadata &&
            link.metadata.map((md) => (
              <LinkActionCard metadata={md} key={md.key} />
            ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
