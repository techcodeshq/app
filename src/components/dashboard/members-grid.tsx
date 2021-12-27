import {
  Box,
  Grid,
  GridItem,
  Divider,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import useSWR, { Fetcher } from "swr";
import axios from "../../lib/axios";
import { User } from "../../types/user";
import { MemberRow } from "./member-row";

export const MembersGrid: React.FC = () => {
  const boxColor = useColorModeValue("bg.100", "bg.800");
  const mobileGrid = useBreakpointValue({ base: true, md: false });
  const { data, error } = useSWR("/users", async (url) => {
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
        padding="1.5rem"
        fontWeight="bold"
      >
        {!mobileGrid && <GridItem>Avatar</GridItem>}
        <GridItem>OSIS</GridItem>
        <GridItem>Name</GridItem>
        {!mobileGrid && <GridItem>Email Address</GridItem>}
        <GridItem>Points</GridItem>
      </Grid>
      <Divider color="secondary" />
      {/* {data && data.map((user) => <MemberRow user={user} key={user.id} />)} */}
      {data &&
        [...Array(30)].map(() => <MemberRow user={data[0]} key={data[0].id} />)}
    </Box>
  );
};
