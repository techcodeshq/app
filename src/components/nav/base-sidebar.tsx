import { Flex, IconButton, useColorModeValue } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import { SVGLink } from "./sidebar";

export const VerticalSidebar: React.FC = () => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const borderColor = useColorModeValue("bg.200", "bg.700");

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w="4rem"
      h="100vh"
      bgColor={bgColor}
      flexDir="column"
      p="2rem 1rem"
      border="0.1rem solid"
      borderColor={borderColor}
    >
      <SVGLink to="/dashboard" src="/logo.svg" alt="Logo" />
      <IconButton
        width="2.5rem"
        height="2.5rem"
        icon={<FiLogOut />}
        aria-label="log out"
        onClick={() => signOut()}
      />
    </Flex>
  );
};

export const HorizontalSidebar: React.FC = () => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const borderColor = useColorModeValue("bg.200", "bg.700");

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      h="4rem"
      bgColor={bgColor}
      flexDir="row"
      p="1rem 2rem"
      border="0.1rem solid"
      borderColor={borderColor}
    >
      <SVGLink to="/dashboard" src="/logo.svg" alt="Logo" />
      <IconButton
        width="2.5rem"
        height="2.5rem"
        icon={<FiLogOut />}
        aria-label="log out"
        onClick={() => signOut()}
      />
    </Flex>
  );
};
