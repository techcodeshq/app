import { SettingsIcon } from "@chakra-ui/icons";
import {
  Flex,
  HStack,
  IconButton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { TooltipButton } from "@components/ui/tooltip-button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { FiLogOut } from "react-icons/fi";
import { SVGLink } from "../shared/svg-link";

export const SidebarTop: React.FC = ({ children }) => (
  <>
    <SVGLink to="/dashboard" src="/logo.svg" alt="Logo" />
    {children}
  </>
);
export const SidebarCenter: React.FC = ({ children }) => <>{children}</>;
export const SidebarBottom: React.FC = ({ children }) => {
  const router = useRouter();

  return (
    <Stack spacing="1rem">
      {children}
      <TooltipButton
        label="Settings"
        placement="right"
        icon={<SettingsIcon />}
        variant="outline"
        onClick={() => router.push("/settings")}
      />
      <TooltipButton
        label="Log Out"
        placement="right"
        icon={<FiLogOut />}
        onClick={() => signOut()}
      />
    </Stack>
  );
};

export const Sidebar: React.FC = ({ children }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const borderColor = useColorModeValue("bg.200", "bg.700");

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w="4rem"
      h="100vh"
      top={0}
      position="fixed"
      zIndex={1}
      bgColor={bgColor}
      flexDir="column"
      p="2rem 1rem"
      border="0.1rem solid"
      borderColor={borderColor}
    >
      {children}
    </Flex>
  );
};

export const TopbarLeft: React.FC = ({ children }) => (
  <HStack spacing="1rem">
    <SVGLink to="/dashboard" src="/logo.svg" alt="Logo" />
    {children}
  </HStack>
);

export const TopbarRight: React.FC<{ signOutBtn?: boolean }> = ({
  signOutBtn = true,
  children,
}) => (
  <HStack spacing="1rem">
    {children}
    {signOutBtn && (
      <IconButton
        width="2.5rem"
        height="2.5rem"
        icon={<FiLogOut />}
        aria-label="log out"
        onClick={() => signOut()}
      />
    )}
  </HStack>
);

export const Topbar: React.FC<{ heading?: string }> = ({ children }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const borderColor = useColorModeValue("bg.200", "bg.700");

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      h="4rem"
      position="fixed"
      top={0}
      zIndex={1}
      bgColor={bgColor}
      flexDir="row"
      p="1rem 2rem"
      border="0.1rem solid"
      borderColor={borderColor}
    >
      {children}
    </Flex>
  );
};
