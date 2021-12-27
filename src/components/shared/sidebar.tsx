import {
  Box,
  Flex,
  IconButton,
  Image,
  Link,
  useBreakpointValue,
  useColorModePreference,
  useColorModeValue,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import React from "react";
import { FiLogOut } from "react-icons/fi";

const SVGLink: React.FC<{
  to: string;
  src: string;
  alt: string;
  newTab?: boolean;
}> = ({ to, src, alt, newTab }) => (
  <Link href={to} target={newTab ? "_blank" : undefined}>
    <Image src={src} alt={alt} w="2.5rem" h="2.5rem" />
  </Link>
);

export const Sidebar: React.FC = () => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const borderColor = useColorModeValue("bg.200", "black");
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w={{ base: "100%", md: "4rem" }}
      h={{ base: "4rem", md: "100vh" }}
      position="fixed"
      top={0}
      zIndex={1}
      bgColor={bgColor}
      flexDirection={{ base: "row", md: "column" }}
      padding={{ base: "1.5rem", md: "2rem 0" }}
      border="0.1rem solid"
      borderColor={borderColor}
    >
      {/* <Box> */}
      <SVGLink to="/dashboard" src="/logo.svg" alt="Logo" />
      {/* </Box> */}
      <IconButton
        width="2.5rem"
        height="2.5rem"
        icon={<FiLogOut />}
        aria-label="log out"
        variant="outline"
        onClick={() => signOut()}
      />
    </Flex>
  );
};
