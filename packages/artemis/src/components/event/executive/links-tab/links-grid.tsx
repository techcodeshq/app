import {
  Box,
  Center,
  Heading,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { EventLink, LinkApplyInstructions } from "@prisma/client";
import React from "react";
import { useEvent } from "../context";
import { LinksRow } from "./link-row";

export type LinkWithMetadata = EventLink & {
  metadata: LinkApplyInstructions[];
};

export const LinksGrid: React.FC = () => {
  const boxColor = useColorModeValue("bg.100", "bg.800");
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const { searchFilter, event } = useEvent();
  const { data } = useQuery<LinkWithMetadata[]>(`/links/${event.id}`);

  return (
    <>
      {!data ||
        (data.length === 0 && (
          <Center height="100%">
            <Heading color="gray.600" p="10rem 0rem">
              This event has no links!
            </Heading>
          </Center>
        ))}
      {data && data.length > 0 && (
        <Box
          bgColor={boxColor}
          borderRadius="0.4rem"
          overflow="auto"
          onTouchEnd={(event) => event.stopPropagation()}
        >
          <Table size="lg">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Uses</Th>
                {!mobileGrid && <Th>Enabled</Th>}
                <Th isNumeric />
              </Tr>
            </Thead>
            <Tbody>
              {data.filter(searchFilter).map((link) => (
                <LinksRow link={link} />
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </>
  );
};
