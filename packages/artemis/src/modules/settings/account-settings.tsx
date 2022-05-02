import {
  Avatar,
  Box,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

export const AccountSettings: React.FC = () => {
  const { data: session } = useSession({ required: false });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const itemBgColor = useColorModeValue("bg.100", "bg.700");
  const changeOsis = useMutation<User, { osis: string }>(
    "/auth/registerOsis",
    "patch",
  );

  return (
    <Box p="1rem 0" bgColor={itemBgColor} mb="4rem">
      <Flex p="0 1.5rem" justifyContent="space-between" alignItems="center">
        <Box>
          <Heading fontWeight="500" fontSize="1.8rem" pb="2">
            Account Info
          </Heading>
          {session && (
            <Stack
              gap="1rem"
              fontSize="1.1rem"
              direction={{ base: "column", md: "row" }}
            >
              <Text>Name: {session.user.name}</Text>
              <Text>Email: {session.user.email}</Text>
            </Stack>
          )}
        </Box>
        {!isMobile && session && <Avatar src={session.user.image} size="lg" />}
      </Flex>
    </Box>
  );
};
