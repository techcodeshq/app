import {
  Avatar,
  Box,
  Divider,
  GridItem,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Grid } from "@components/ui/grid";
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
            {/* {!mobileGrid && <Th>Avatar</Th>} */}
            <Th>Avatar</Th>
            <Th>OSIS</Th>
            <Th>Name</Th>
            {!mobileGrid && <Th>Email</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.filter(searchFilter).map((user) => <MemberRow user={user} />)}
        </Tbody>
      </Table>
      {/* <Grid templateColumns={mobileGrid ? "repeat(4, 1fr)" : "repeat(6, 1fr)"}>
        {!mobileGrid && <GridItem>Avatar</GridItem>}
        <GridItem>OSIS</GridItem>
        <GridItem>Name</GridItem>
        {!mobileGrid && <GridItem>Email Address</GridItem>}
        <GridItem>Metadata</GridItem>
        <GridItem />
        {data &&
          data.filter(searchFilter).map((user) => (
            // <React.Fragment key={user.id}>
            <MemberRow user={user} />
            // <GridItem colSpan={mobileGrid ? 4 : 6}>
            // <Divider />
            // </GridItem>
            // </React.Fragment>
          ))}
      </Grid> */}
    </Box>
  );
};
