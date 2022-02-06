import {
  Flex,
  Heading,
  HStack,
  Stack,
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
    <Flex flexDir="column" gap="1rem" p="1rem 0">
      <Heading fontWeight="regular">Statistics</Heading>
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
      <Heading fontWeight="regular">History</Heading>
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
    </Flex>
  );
};
