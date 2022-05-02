import {
  Box,
  Circle,
  Divider,
  Flex,
  Heading,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useIsMobile } from "@hooks/useIsMobile";
import { useMutation } from "@hooks/useMutation";
import { Perm, Role } from "@prisma/client";
import { permsMetadata } from "./perms-meta";

export const RolePerms: React.FC<{ role: Role }> = ({ role }) => {
  const setPerms = useMutation<Role, { roleId: string; perms: string[] }>(
    "/roles/perms",
    "patch",
    `/roles`,
  );
  const isMobile = useIsMobile();

  return (
    <Stack>
      <Heading fontWeight="normal" fontSize="1.3rem">
        Permissions
      </Heading>
      <Divider />
      <Stack spacing="1.5rem" pr="1rem">
        {permsMetadata.map((perm) => (
          <Flex
            alignItems="center"
            gap="2rem"
            key={perm.perm}
            justifyContent="space-between"
          >
            <Stack spacing="0.1rem">
              <Flex alignItems="center" gap="0.7rem">
                <Circle
                  bgColor={`${perm.color}.300`}
                  width="0.4rem"
                  height="0.4rem"
                />
                <Text>{perm.name}</Text>
              </Flex>

              <Text
                opacity="50%"
                fontSize={{ base: "0.9rem", md: "0.85rem", lg: "0.9rem" }}
              >
                {perm.description}
              </Text>
            </Stack>
            <Switch
              value={perm.perm}
              isChecked={role.perms.includes(perm.perm)}
              colorScheme={perm.color}
              onChange={async (event) => {
                const { perms } = role;
                if (perms.includes(event.target.value as Perm)) {
                  await setPerms({
                    roleId: role.id,
                    perms: perms.filter((perm) => perm !== event.target.value),
                  });
                } else {
                  await setPerms({
                    roleId: role.id,
                    perms: [...perms, event.target.value],
                  });
                }
              }}
            />
          </Flex>
        ))}
      </Stack>
    </Stack>
  );
};
