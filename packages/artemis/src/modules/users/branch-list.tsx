import {
  Avatar,
  Box,
  Flex,
  HStack,
  Link,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { useBranch } from "@modules/branch/pages/context";
import { BranchMember, Role, User } from "@prisma/client";
import { ManageMemberRoles } from "./manage-roles";
import React from "react";
import { useRouter } from "next/router";
import { ContextItem } from "@components/context-item";
import { ContextMenu } from "@components/context-menu";

export const BranchMembersList: React.FC = () => {
  const { branch } = useBranch();
  const rolesCtrl = useDisclosure();
  const { data: members } = useQuery<
    (BranchMember & { user: User; roles: Role[] })[]
  >(`/branches/${branch.id}/members`);
  const router = useRouter();

  return (
    <Stack spacing="1rem" overflow="auto" mt="1rem" pr="0.5rem">
      {members &&
        members.map((member) => (
          <React.Fragment key={member.id}>
            <Flex
              onClick={() =>
                router.push(`/branch/${branch.slug}/members/${member.id}`)
              }
              onAuxClick={(e) => {
                if (e.button === 1) {
                  window.open(
                    `/branch/${branch.slug}/members/${member.id}`,
                    "_blank",
                  );
                }
              }}
              bgColor="bg.700"
              p="1rem"
              borderRadius="0.5rem"
              alignItems="center"
              justifyContent="space-between"
              transition="background-color 0.2s ease-in"
              _hover={{ cursor: "pointer", bgColor: "bg.650" }}
            >
              <Flex alignItems="center" gap="1rem">
                <Avatar src={member.user.image} />
                <Box>
                  <Text>{member.user.name}</Text>
                  <Text opacity="50%">{member.user.email}</Text>
                </Box>
              </Flex>
              <ContextMenu>
                <ContextItem
                  text="Manage Roles"
                  onClick={rolesCtrl.onOpen}
                  Icon={null}
                />
              </ContextMenu>
            </Flex>
            <ManageMemberRoles control={rolesCtrl} member={member} />
          </React.Fragment>
        ))}
    </Stack>
  );
};
