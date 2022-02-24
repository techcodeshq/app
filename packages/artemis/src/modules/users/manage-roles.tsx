import {
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseDisclosureReturn,
  Flex,
  Checkbox,
  Divider,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import { useBranch } from "@modules/branch/pages/context";
import { BranchMember, Role, User } from "@prisma/client";
import { useEffect, useState } from "react";

export const ManageMemberRoles: React.FC<{
  control: UseDisclosureReturn;
  member: BranchMember & { user: User; roles: Role[] };
}> = ({ control, member }) => {
  const { branch } = useBranch();
  const { isOpen, onClose } = control;
  const { data: roles } = useQuery<Role[]>(`/branches/${branch.id}/roles`);
  const setRoles = useMutation<
    BranchMember & { roles: Role[] },
    { memberId: string; roles: string[] }
  >("/roles/grant", "post", `/branches/${branch.id}/members`);

  useEffect(() => {
    console.log(member);
  }, [member]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor="bg.900">
        <ModalHeader fontWeight="medium">Manage Roles</ModalHeader>
        <ModalBody>
          {roles &&
            roles.map((role) => (
              <>
                <Flex
                  key={role.id}
                  p="1rem 0"
                  justifyContent="space-between"
                  alignItems="center"
                  fontSize="1.2rem"
                >
                  <Text>{role.name}</Text>
                  <Checkbox
                    size="lg"
                    isChecked={member.roles
                      .map((role) => role.id)
                      .includes(role.id)}
                    onChange={async (event) => {
                      const { checked } = event.target;
                      const roleIds = member.roles.map((r) => r.id);

                      if (checked && !roleIds.includes(role.id)) {
                        return await setRoles({
                          memberId: member.id,
                          roles: [...roleIds, role.id],
                        });
                      }

                      if (!checked && roleIds.includes(role.id)) {
                        return await setRoles({
                          memberId: member.id,
                          roles: roleIds.filter((r) => r !== role.id),
                        });
                      }
                    }}
                  />
                </Flex>
              </>
            ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
