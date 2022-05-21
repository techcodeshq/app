import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Center,
  Flex,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { actionBasedValue } from "src/util/actionBasedValue";
import {
  EventLink,
  EventLinkRedeemStatus,
  LinkApplyInstructions,
} from "@prisma/client";
import moment from "moment";
import { Response } from "./link-data";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";
import { LinkRedeemCard } from "./redeem-card";
import { LinkActionCard } from "./action-card";

export const LinkDataMobile: React.FC<{
  link: EventLink & { metadata: LinkApplyInstructions[] };
}> = ({ link }) => {
  const { data } = useQuery<Response[]>(`/links/redeemed/${link.id}`, {
    refreshInterval: 1000,
  });
  const bgColor = useColorModeValue("bg.100", "bg.700");

  return (
    <Tabs
      variant="line"
      colorScheme="accent"
      isLazy
      overflowY="auto"
      overflowX="hidden"
      h="100%"
      isFitted
    >
      <Flex gap="1rem" flexDir="column">
        <TabList>
          <Tab>Redeems</Tab>
          <Tab>Info</Tab>
        </TabList>
        <TabPanels overflow="auto">
          <TabPanel display="flex" flexDir="column" gap="1rem" p="0">
            {data &&
              data.map((item) => (
                <LinkRedeemCard redeem={item} key={item.userId} />
              ))}
          </TabPanel>
          <TabPanel display="flex" flexDir="column" gap="1rem" p="0">
            {link.metadata &&
              link.metadata.map((md, i) => (
                <LinkActionCard metadata={md} key={i} />
              ))}
          </TabPanel>
        </TabPanels>
      </Flex>
    </Tabs>
  );
};
