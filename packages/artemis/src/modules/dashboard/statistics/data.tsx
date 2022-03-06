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
import { Return } from "../../../components/dashboard/member";
import { EditableValue } from "../../../components/dashboard/member/value-edit";
import { actionBasedColor } from "./actionBasedColor";
import { Query } from "./query";
import moment from "moment";

export const MemberData: React.FC<{ data: Query }> = ({ data }) => {
  const boxColor = useColorModeValue("bg.100", "bg.700");

  return (
    <>
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
                    <Td>{md.value}</Td>
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
                data.linkRedeem.map((link) =>
                  link.eventLink.metadata.map((m, index) => (
                    <Tr key={`${link.createdAt}-${index}`}>
                      <Td color={actionBasedColor(m.action)}>
                        {link.eventLink.name}
                      </Td>
                      <Td color={actionBasedColor(m.action)}>{m.key}</Td>
                      <Td color={actionBasedColor(m.action)}>
                        {actionBasedValue(m.action, ["+", "-", "="])}
                        {m.value}
                      </Td>
                      <Td color={actionBasedColor(m.action)}>
                        {moment(link.createdAt).isSame(moment(), "day")
                          ? new Date(link.createdAt).toLocaleTimeString()
                          : new Date(link.createdAt).toLocaleDateString()}
                      </Td>
                    </Tr>
                  )),
                )}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </>
  );
};
