import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Sidebar,
  SidebarBottom,
  SidebarTop,
  Topbar,
  TopbarLeft,
  TopbarRight,
} from "@ui/sidebar";
import { useMutation } from "@hooks/useMutation";
import { User } from "@prisma/client";
import { NextPage } from "next";
import { Layout } from "@components/layout";

const Settings: NextPage<{ user: User }> = ({ user }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue("bg.50", "bg.800");
  const itemBgColor = useColorModeValue("bg.100", "bg.700");
  const changeOsis = useMutation<User, { osis: string }>(
    "/auth/registerOsis",
    "patch",
  );

  return (
    <Layout title="Settings">
      {isMobile ? (
        <Topbar>
          <TopbarLeft />
          <TopbarRight />
        </Topbar>
      ) : (
        <Sidebar>
          <SidebarTop />
          <SidebarBottom />
        </Sidebar>
      )}
      <Box width="90%" m="0 auto" bgColor={bgColor} p="2rem">
        <Heading>Account</Heading>
        <Box p="2rem 0" bgColor={itemBgColor} mt="2rem">
          <Flex p="0 1.5rem" justifyContent="space-between" alignItems="center">
            <Box>
              <Heading fontWeight="500" fontSize="1.8rem">
                Account Info
              </Heading>
              <Stack
                gap="1rem"
                fontSize="1.1rem"
                direction={{ base: "column", md: "row" }}
              >
                <Text>Name: {user.name}</Text>
                <Text>Email: {user.email}</Text>
              </Stack>
            </Box>
            {!isMobile && <Avatar src={user.image} size="lg" />}
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
};

export default Settings;
