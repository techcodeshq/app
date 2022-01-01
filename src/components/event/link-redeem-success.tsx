import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Sidebar } from "@components/nav/base-sidebar";
import { EventLink, LinkApplyInstructions } from "@typings";
import React from "react";

interface LinkRedeemSuccessProps {
  link: EventLink & { metadata: LinkApplyInstructions[] };
}

const LinkRedeemSuccess: React.FC<LinkRedeemSuccessProps> = ({ link }) => {
  const boxColor = useColorModeValue("bg.100", "bg.800");

  return (
    <Flex flexDirection="column" justifyContent="space-between" h="100vh">
      <Sidebar />
      <Flex
        justifyContent="center"
        w="80%"
        h="80%"
        m="auto"
        flexDir={{ base: "column", md: "row" }}
      >
        <Box flex="2">
          <Center as={VStack} h="100%">
            <Image src="/party-face.png" w="15rem" />
            <Heading fontSize="1.5rem">Congratulations</Heading>
            <Text color="green.300">
              The link has been sucessfully redeemed!
            </Text>
          </Center>
        </Box>
        <Box bgColor={boxColor} flex="1" borderRadius="0.5rem">
          <Grid
            templateColumns="repeat(3, 1fr)"
            p="2rem"
            gap="1rem"
            fontWeight="600"
          >
            <GridItem>Key</GridItem>
            <GridItem>Action</GridItem>
            <GridItem>Value</GridItem>
            {link.metadata &&
              link.metadata.map((md) => (
                <>
                  <GridItem
                    color={
                      md.action === "INCREMENT"
                        ? "green.300"
                        : md.action === "DECREMENT"
                        ? "red.300"
                        : "white"
                    }
                  >
                    {md.key}
                  </GridItem>
                  <GridItem
                    color={
                      md.action === "INCREMENT"
                        ? "green.300"
                        : md.action === "DECREMENT"
                        ? "red.300"
                        : "white"
                    }
                  >
                    {md.action}
                  </GridItem>
                  <GridItem
                    color={
                      md.action === "INCREMENT"
                        ? "green.300"
                        : md.action === "DECREMENT"
                        ? "red.300"
                        : "white"
                    }
                  >
                    {md.value}
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Divider />
                  </GridItem>
                </>
              ))}
          </Grid>
        </Box>
      </Flex>
    </Flex>
  );
};

export default LinkRedeemSuccess;
