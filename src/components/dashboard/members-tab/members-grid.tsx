import {
  Box,
  Divider,
  Grid,
  GridItem,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import axios from "../../../lib/axios";
import { User } from "../../../types/user";
import { useDashboard } from "../context";
import { MemberRow } from "./member-row";

export const MembersGrid: React.FC = () => {
  const boxColor = useColorModeValue("bg.100", "bg.800");
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const { searchFilter } = useDashboard();
  const { data } = useSWR("/users", async (url) => {
    const res = await axios.get<User[]>(url);
    return res.data;
  });

  return (
    <Box
      width="100%"
      mt="2rem"
      bgColor={boxColor}
      borderRadius="0.4rem"
      overflow="auto"
    >
      <Grid
        templateColumns={mobileGrid ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr 1fr"}
        gap="2rem"
        padding="1.5rem"
        fontWeight="bold"
      >
        {!mobileGrid && <GridItem>Avatar</GridItem>}
        <GridItem>OSIS</GridItem>
        <GridItem>Name</GridItem>
        {!mobileGrid && <GridItem>Email Address</GridItem>}
        <GridItem>Points</GridItem>
        {data &&
          data.filter(searchFilter).map((user) => (
            <>
              <MemberRow user={user} key={user.id} />
              <GridItem colSpan={mobileGrid ? 3 : 5}>
                <Divider />
              </GridItem>
            </>
          ))}
      </Grid>
    </Box>
  );
};
