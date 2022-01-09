import { Box, Flex } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";

interface LayoutProps {
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title} | TechCodes</title>
      </Head>
      <Flex flexDirection={{ base: "column", md: "row" }} height="100vh">
        {React.Children.toArray(children)[0]}
        <Box width="100%" padding={{ base: "1.5rem", md: "2rem 0" }}>
          <Flex
            m={{ base: "4rem auto auto", md: "auto 4rem auto 8rem" }}
            flexDirection={{ base: "column", md: "row" }}
            maxWidth="90vw"
            height="100%"
            justifyContent="space-between"
          >
            <Flex width="100%" flexDirection="column" height="100%">
              {React.Children.toArray(children).slice(1)}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
