import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { Sidebar } from "../nav/sidebar";
import { useDashboard } from "./context";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { selectedTab } = useDashboard();

  return (
    <>
      <Head>
        <title>{selectedTab} | TechCodes</title>
      </Head>
      <Flex flexDirection={{ base: "column", md: "row" }} height="100vh">
        <Sidebar />
        {children}
      </Flex>
    </>
  );
};

export default Layout;
