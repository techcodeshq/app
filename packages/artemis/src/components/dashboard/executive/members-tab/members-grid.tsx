import {
  Box,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { User } from "@prisma/client";
import React from "react";
import { useDashboard } from "../context";
import { MemberRow } from "./member-row";

export const MembersGrid: React.FC = () => {
  const boxColor = useColorModeValue("bg.100", "bg.800");
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const { searchFilter } = useDashboard();
  const { data } = useQuery<User[]>("/users");

  return (
    <Box
      width="100%"
      mt="2rem"
      bgColor={boxColor}
      borderRadius="0.4rem"
      overflow="auto"
    >
      <Table variant="simple" size="lg">
        <Thead>
          <Tr>
            {!mobileGrid && <Th>Avatar</Th>}
            {!mobileGrid && <Th>OSIS</Th>}
            <Th>Name</Th>
            {!mobileGrid && <Th>Email</Th>}
            <Th isNumeric>More</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.filter(searchFilter).map((user) => <MemberRow user={user} />)}
        </Tbody>
      </Table>
    </Box>
  );
};
