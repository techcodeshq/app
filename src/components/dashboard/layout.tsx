import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { Sidebar } from "../nav/sidebar";

interface LayoutProps {
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Flex flexDirection={{ base: "column", md: "row" }} height="100vh">
        <Sidebar />
        {children}
      </Flex>
    </>
  );
};

export default Layout;
