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
import { EditableValue } from "@modules/users/statistics/value-edit";
import { actionBasedValue } from "src/util/actionBasedValue";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { Perm } from "@prisma/client";
import moment from "moment";
import { useRouter } from "next/router";
import { actionBasedColor } from "./actionBasedColor";
import { Query } from "./query";

export const UserData: React.FC<{ data: Query }> = ({ data }) => {
  const { query } = useRouter();
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
                    <Td>
                      <RenderIfAllowed perms={[Perm.MANAGE_USERS]}>
                        {(allowed) =>
                          // only allow editing if perms and an [id]
                          query.id && allowed ? (
                            <EditableValue metadata={md} />
                          ) : (
                            md.value
                          )
                        }
                      </RenderIfAllowed>
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
                data.linkRedeem.map((link) =>
                  link.eventLink.metadata.map((m, index) => (
                    <Tr key={`${link.createdAt}-${index}`}>
                      {/* Event's name */}
                      <Td color={actionBasedColor(m.action)}>
                        {link.eventLink.name}
                      </Td>

                      {/* Key of metadata which is changed */}
                      <Td color={actionBasedColor(m.action)}>{m.key}</Td>
                      {/* Increase / decrease */}
                      <Td color={actionBasedColor(m.action)}>
                        {actionBasedValue(m.action, ["+", "-", "="])}
                        {m.value}
                      </Td>

                      {/* Day, but fancier */}
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
