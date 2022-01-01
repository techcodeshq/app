import { Box, Flex } from "@chakra-ui/react";
import { DashboardProvider } from "./context";
import Layout from "./layout";
import Tabs from "./tabs";

export const ExecutiveDashboardView = () => (
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
