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
import { actionBasedValue } from "@lib/util/actionBasedValue";
import {
  EventLink,
  EventLinkRedeemStatus,
  LinkApplyInstructions,
} from "@prisma/client";
import moment from "moment";
import { Response } from "./link-data";
import QRCode from "qrcode.react";

export const LinkDataMobile: React.FC<{
  link: EventLink & { metadata: LinkApplyInstructions[] };
  fullUrl: string;
}> = ({ link, fullUrl }) => {
  const { data } = useQuery<Response>(`/links/redeemed/${link.id}`, {
    refreshInterval: 1000,
  });
  const bgColor = useColorModeValue("bg.100", "bg.800");

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
          <Tab>QRCode</Tab>
        </TabList>
        <TabPanels overflow="auto">
          <TabPanel display="flex" flexDir="column" gap="1rem">
            {data &&
              data.map(({ user, ...redeem }, index) => (
                <Flex
                  p="1.5rem"
                  bgColor={bgColor}
                  borderRadius="0.4rem"
                  alignItems="center"
                  justifyContent="space-between"
                  shadow="md"
                  key={redeem.userId}
                >
                  <Flex gap="1rem" alignItems="center">
                    <Avatar src={user.image} size="md" />
                    <Stack spacing={0}>
                      <Text fontWeight="600">{user.name}</Text>
                      <Text>
                        {moment(redeem.createdAt).isSame(moment(), "day")
                          ? new Date(redeem.createdAt).toLocaleTimeString()
                          : new Date(redeem.createdAt).toLocaleDateString()}
                      </Text>
                    </Stack>
                  </Flex>
                  {redeem.status === EventLinkRedeemStatus.SUCCESS ? (
                    <CheckIcon />
                  ) : (
                    <CloseIcon />
                  )}
                </Flex>
              ))}
          </TabPanel>
          <TabPanel>
            {link.metadata &&
              link.metadata.map((md) => (
                <Flex
                  p="1rem"
                  bgColor={bgColor}
                  borderRadius="0.4rem"
                  alignItems="center"
                  justifyContent="space-between"
                  shadow="md"
                  key={md.key}
                >
                  <Text>{md.key}</Text>
                  <Text
                    color={actionBasedValue(md.action, [
                      "green.300",
                      "red.300",
                      null,
                    ])}
                  >
                    {actionBasedValue(md.action, ["+", "-", "="])}
                    {md.value}
                  </Text>
                </Flex>
              ))}
          </TabPanel>
          <TabPanel display="flex" gap="1rem" flexDir="column">
            <Center>
              <QRCode value={fullUrl || window?.location?.href} size={256} />
            </Center>
            <Center>
              <Heading>Code: {link.code}</Heading>
            </Center>
          </TabPanel>
        </TabPanels>
      </Flex>
    </Tabs>
  );
};
