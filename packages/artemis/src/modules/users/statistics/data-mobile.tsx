import {
  Flex,
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
import { EditableValue } from "@modules/users/statistics/value-edit";
import { actionBasedValue } from "src/util/actionBasedValue";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { Perm } from "@prisma/client";
import moment from "moment";
import { actionBasedColor } from "./actionBasedColor";
import { Query } from "./query";

export const UserDataMobile: React.FC<{ data: Query }> = ({ data }) => {
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
                  borderRadius="0.5rem"
                  alignItems="center"
                  justifyContent="space-between"
                  shadow="md"
                  key={md.key}
                >
                  <Text>{md.key}</Text>
                  <Text>
                    <RenderIfAllowed perms={[Perm.MANAGE_USERS]}>
                      {(allowed) =>
                        allowed ? <EditableValue metadata={md} /> : md.value
                      }
                    </RenderIfAllowed>
                  </Text>
                </Flex>
              ))}
          </TabPanel>
          <TabPanel display="flex" flexDir="column" gap="1rem" p="0">
            {data &&
              data.linkRedeem.map((link) =>
                link.eventLink.metadata.map((m, index) => (
                  <Flex
                    p="1rem"
                    bgColor={bgColor}
                    borderRadius="0.5rem"
                    alignItems="center"
                    justifyContent="space-between"
                    shadow="md"
                    key={`${link.createdAt}-${index}`}
                  >
                    <Stack spacing={0}>
                      <Text>{link.eventLink.name}</Text>
                      <HStack>
                        <Text color={actionBasedColor(m.action)}>{m.key}</Text>
                        <Text color={actionBasedColor(m.action)}>
                          {actionBasedValue(m.action, ["+", "-", "="])}
                          {m.value}
                        </Text>
                      </HStack>
                    </Stack>
                    <Text>
                      {moment(link.createdAt).isSame(moment(), "day")
                        ? new Date(link.createdAt).toLocaleTimeString()
                        : new Date(link.createdAt).toLocaleDateString()}
                    </Text>
                  </Flex>
                )),
              )}
          </TabPanel>
        </TabPanels>
      </Flex>
    </Tabs>
  );
};
