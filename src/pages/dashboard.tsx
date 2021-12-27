import { Box, Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import { DashboardProvider } from "../components/dashboard/context";
import Layout from "../components/dashboard/layout";
import Tabs from "../components/dashboard/tabs";

interface DashboardProps {
  session: Session;
}

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  return (
    <DashboardProvider>
      <Layout title="Members | TechCodes">
        <Box width="100%" padding={{ base: "1.5rem", md: "2rem 0" }}>
          <Flex
            m={{ base: "2.5rem auto auto", md: "auto 8rem" }}
            flexDirection={{ base: "column", md: "row" }}
            maxWidth="90vw"
            height="100%"
            justifyContent="space-between"
          >
            <Tabs />
          </Flex>
        </Box>
      </Layout>
    </DashboardProvider>
  );
};

export { getServerSideProps } from "../lib/util/osisRedirect";

export default Dashboard;
