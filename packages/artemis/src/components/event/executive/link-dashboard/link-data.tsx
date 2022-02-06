import {
  Center,
  Flex,
  Heading,
  HStack,
  Link,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { LinkActions } from "@components/event/link-actions";
import { useQuery } from "@hooks/useQuery";
import {
  EventLink,
  EventLinkRedeem,
  LinkApplyInstructions,
} from "@prisma/client";
import QRCode from "qrcode.react";
import { LinkRedeemRow } from "./redeem-row";

export type Response = (EventLinkRedeem & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
})[];

export const LinkData: React.FC<{
  link: EventLink & { metadata: LinkApplyInstructions[] };
  fullUrl: string;
}> = ({ link, fullUrl }) => {
  const boxColor = useColorModeValue("bg.100", "bg.800");
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const { data } = useQuery<Response>(`/links/redeemed/${link.id}`, {
    refreshInterval: 1000,
  });
  const qrSize = useBreakpointValue({ base: 200, lg: 250 });

  return (
    <Flex
      pt="2rem"
      gap="2rem"
      h="100%"
      width={{ base: null, md: "100%" }}
      overflow="auto"
      flexDirection={{ base: "column", md: "row" }}
    >
      <Flex flex="2">
        <Flex
          flexDir="column"
          gap="1rem"
          bgColor={boxColor}
          borderRadius="0.4rem"
          width={{ base: "100%", md: null }}
          overflow="auto"
        >
          <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
            Redeemed
          </Heading>
          <Table size="lg">
            <Thead>
              <Tr>
                {!isMobile && <Th>Avatar</Th>}
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Time</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {data && data.map((item) => <LinkRedeemRow item={item} />)}
            </Tbody>
          </Table>
        </Flex>
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
        >
          <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
            Actions
          </Heading>
          <Table size="lg">
            <Thead>
              <Tr>
                <Th>Key</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {link.metadata &&
                link.metadata.map((md) => <LinkActions metadata={md} />)}
            </Tbody>
          </Table>
        </Flex>
      </Flex>
    </Flex>
  );
};
