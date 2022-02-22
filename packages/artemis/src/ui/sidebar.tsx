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
import { FiLogOut } from "react-icons/fi";
import { SVGLink } from "@components/shared/svg-link";

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
      {/* <TooltipButton
        label="Settings"
        placement="right"
        icon={<SettingsIcon />}
        variant="outline"
        onClick={() => router.push("/settings")}
      /> */}
      {/* {session?.user.role === Role.EXEC && ( */}
      <TooltipButton
        label="Audit log"
        placement="right"
        icon={<BiBookAlt />}
        variant="outline"
        onClick={() => router.push("/audit-log")}
      />
      {/* )} */}
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
  // const bgColor = useColorModeValue("bg.100", "bg.800");
  // const borderColor = useColorModeValue("bg.200", "bg.700");

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w="4rem"
      h="100vh"
      top={0}
      position="fixed"
      zIndex={1}
      // bgColor={bgColor}
      flexDir="column"
      p="2rem 1rem"
      // border="0.1rem solid"
      // borderColor={borderColor}
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
  // const borderColor = useColorModeValue("bg.200", "bg.900");

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
      // borderBottom="0.01rem solid"
      // borderColor={borderColor}
    >
      {children}
    </Flex>
  );
};
