import {
  Flex,
  Heading,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { User } from "@prisma/client";
import { Return } from ".";
import { EditableValue } from "./value-edit";
import { actionBasedColor } from "./actionBasedColor";
import { actionBasedValue } from "@lib/util/actionBasedValue";

export const MemberDataMobile: React.FC<{ route: string; user: User }> = ({
  route,
  user,
}) => {
  const { data } = useQuery<Return>(route);
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
          <Tab>Statistics</Tab>
          <Tab>History</Tab>
        </TabList>
        <TabPanels overflow="auto">
          <TabPanel display="flex" flexDir="column" gap="1rem" p="0">
            {data &&
              data.metadata.map((md) => (
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
                  <EditableValue metadata={md} route={route} user={user} />
                </Flex>
              ))}
          </TabPanel>
          <TabPanel display="flex" flexDir="column" gap="1rem" p="0">
            {data &&
              data.links.map((link) =>
                link.eventLink.metadata.map((m, index) => (
                  <Flex
                    p="1rem"
                    bgColor={bgColor}
                    borderRadius="0.4rem"
                    alignItems="center"
                    justifyContent="space-between"
                    shadow="md"
                    key={`${link.createdAt}-${index}`}
                  >
                    <Stack spacing={0}>
                      <Text>{m.eventLink.name}</Text>
                      <HStack>
                        <Text color={actionBasedColor(m.action)}>{m.key}</Text>
                        <Text color={actionBasedColor(m.action)}>
                          {actionBasedValue(m.action, ["+", "-", "="])}
                          {m.value}
                        </Text>
                      </HStack>
                    </Stack>
                    <Text>{new Date(link.createdAt).toLocaleString()}</Text>
                  </Flex>
                )),
              )}
          </TabPanel>
        </TabPanels>
      </Flex>
    </Tabs>
  );
};
