import { SettingsIcon } from "@chakra-ui/icons";
import {
  Flex,
  HStack,
  IconButton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { TooltipButton } from "src/ui/tooltip-button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { BiBookAlt } from "react-icons/bi";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { SVGLink } from "@components/svg-link";

export const SidebarTop: React.FC = ({ children }) => (
  <Stack spacing="3rem">
    <SVGLink to="/dashboard" src="/logo.svg" alt="Logo" />
    {children}
  </Stack>
);

export const SidebarCenter: React.FC = ({ children }) => <>{children}</>;
export const SidebarBottom: React.FC = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Stack spacing="1rem">
      {children}
      {/* {session?.user.role === Role.EXEC && ( */}
      {/* <TooltipButton
        label="Audit log"
        placement="right"
        icon={<BiBookAlt />}
        variant="outline"
        onClick={() => router.push("/audit-log")}
      /> */}
      {/* )} */}
      <TooltipButton
        label="Settings"
        placement="right"
        icon={<FiSettings />}
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
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w="4rem"
      h="100vh"
      top={0}
      position="fixed"
      zIndex={1}
      flexDir="column"
      p="2rem 1rem"
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
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      h="4rem"
      position="fixed"
      top={0}
      zIndex={1}
      flexDir="row"
      p="1rem 1rem"
      shadow="lg"
    >
      {children}
    </Flex>
  );
};
