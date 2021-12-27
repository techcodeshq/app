import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import Head from "next/head";
import React from "react";
import { MembersTab } from "../components/dashboard/members-tab";
import { Sidebar } from "../components/shared/sidebar";

interface DashboardProps {
  session: Session;
}

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Head>
        <title>Dashboard | TechCodes</title>
      </Head>
      <Flex flexDirection={{ base: "column", md: "row" }} height="100vh">
        {/* <Box overflow="hidden"> */}
        <Sidebar />
        {/* </Box> */}
        <Box width="100%" padding={{ base: "2.5rem", md: "2rem 0" }}>
          <Flex
            m={{ base: "2.5rem auto auto", md: "auto" }}
            flexDirection={{ base: "column", md: "row" }}
            maxWidth="90vw"
            height="100%"
            justifyContent="space-between"
          >
            <MembersTab />
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export { getServerSideProps } from "../lib/util/osisRedirect";

export default Dashboard;
