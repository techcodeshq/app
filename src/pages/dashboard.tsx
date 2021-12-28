import { Box, Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import { DashboardProvider } from "@components/dashboard/context";
import Layout from "@components/dashboard/layout";
import Tabs from "@components/dashboard/tabs";
import { withOsisRedirect } from "@lib/util/osisRedirect";

interface DashboardProps {
  session: Session;
}

const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  return (
    <DashboardProvider>
      <Layout>
        <Box width="100%" padding={{ base: "1.5rem", md: "2rem 0" }}>
          <Flex
            m={{ base: "2.5rem auto auto", md: "auto 4rem auto 8rem" }}
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

export const getServerSideProps = withOsisRedirect(({ session }) => {
  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return { props: { session } };
});

export default Dashboard;
