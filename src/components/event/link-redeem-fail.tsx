import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Sidebar } from "@components/nav/base-sidebar";
import React from "react";

interface LinkRedeemFailProps {
  error: string;
}

const LinkRedeemFail: React.FC<LinkRedeemFailProps> = ({ error }) => {
  return (
    <Flex flexDirection="column">
      <Sidebar />
      <Center height="80vh" as={VStack} spacing={5}>
        <Image src="/frown-face.png" w="15rem" />
        <Center as={VStack} spacing={1}>
          <Heading fontSize="1.5rem">
            Oh no! The transaction was unsuccessful
          </Heading>
          <Text color="red.300">{error}</Text>
        </Center>
      </Center>
    </Flex>
  );
};

export default LinkRedeemFail;
