import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { useBranch } from "@modules/branch/pages/context";
import { BranchMember, User } from "@prisma/client";

export const BranchMembersList: React.FC = () => {
  const { branch } = useBranch();
  const { data: members } = useQuery<(BranchMember & { user: User })[]>(
    `/branches/${branch.id}/members`,
  );

  return (
    <Stack spacing="1rem" overflow="auto" mt="1rem" pr="0.5rem">
      {members &&
        members.map(({ user }) => (
          <Flex bgColor="bg.700" p="1rem" borderRadius="0.5rem">
            <Flex alignItems="center" gap="1rem">
              <Avatar src={user.image} />
              <Box>
                <Text>{user.name}</Text>
                <Text opacity="50%">{user.email}</Text>
              </Box>
            </Flex>
          </Flex>
        ))}
    </Stack>
  );
};
