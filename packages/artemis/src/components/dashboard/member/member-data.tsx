import {
  Box,
  Divider,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { actionBasedValue } from "@lib/util/actionBasedValue";
import { User } from "@prisma/client";
import { Return } from ".";
import { EditableValue } from "./value-edit";
import { actionBasedColor } from "./actionBasedColor";

export const MemberData: React.FC<{ route: string; user: User }> = ({
  route,
  user,
}) => {
  const { data } = useQuery<Return>(route);
  const boxColor = useColorModeValue("bg.100", "bg.800");

  return (
    <Flex
      pt="2rem"
      gap="2rem"
      overflow="auto"
      height="100%"
      width={{ base: null, md: "100%" }}
      flexDirection={{ base: "column", md: "row" }}
    >
      <Flex flex="0.5">
        <Box
          bgColor={boxColor}
          borderRadius="0.4rem"
          width={{ base: "100%", md: null }}
          overflow="auto"
          minH="100%"
        >
          <Heading p="1.5rem" fontSize="1.5rem">
            Statistics
          </Heading>
          <Divider />
          <Table size="lg">
            <Thead>
              <Tr>
                <Th>Key</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data &&
                data.metadata.map((md) => (
                  <Tr key={md.key}>
                    <Td>{md.key}</Td>
                    <Td>
                      <EditableValue metadata={md} user={user} route={route} />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
      <Flex flex="1">
        <Box
          bgColor={boxColor}
          borderRadius="0.4rem"
          overflow="auto"
          minH="100%"
          width={{ base: "100%", md: null }}
        >
          <Heading p="1.5rem" fontSize="1.5rem">
            History
          </Heading>
          <Divider />
          <Table size="lg">
            <Thead>
              <Tr>
                <Th>Link</Th>
                <Th>Key</Th>
                <Th>Value</Th>
                <Th>Redeemed</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data &&
                data.links.map((link) =>
                  link.eventLink.metadata.map((m, index) => (
                    <Tr key={`${link.createdAt}-${index}`}>
                      <Td color={actionBasedColor(m.action)}>
                        {m.eventLink.name}
                      </Td>
                      <Td color={actionBasedColor(m.action)}>{m.key}</Td>
                      <Td color={actionBasedColor(m.action)}>
                        {actionBasedValue(m.action, ["+", "-", "="])}
                        {m.value}
                      </Td>
                      <Td color={actionBasedColor(m.action)}>
                        {new Date(link.createdAt).toLocaleString()}
                      </Td>
                    </Tr>
                  )),
                )}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Flex>
  );
};
