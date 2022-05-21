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
import { Role, User } from "@prisma/client";
import React from "react";

export const ManageUserRoles: React.FC<{
  control: UseDisclosureReturn;
  user: User & { roles: Role[] };
}> = ({ control, user }) => {
  const { isOpen, onClose } = control;
  const { data: roles } = useQuery<Role[]>(`/roles`);
  const setRoles = useMutation<
    { roles: Role[] },
    { userId: string; roles: string[] }
  >("/roles/grant", "post");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bgColor="bg.900">
        <ModalHeader fontWeight="medium">Manage Roles</ModalHeader>
        <ModalBody>
          {roles &&
            roles.map((role) => (
              <React.Fragment key={role.id}>
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
                    isChecked={user.roles
                      .map((role) => role.id)
                      .includes(role.id)}
                    onChange={async (event) => {
                      const { checked } = event.target;
                      const roleIds = user.roles.map((r) => r.id);

                      if (checked && !roleIds.includes(role.id)) {
                        return await setRoles({
                          userId: user.id,
                          roles: [...roleIds, role.id],
                        });
                      }

                      if (!checked && roleIds.includes(role.id)) {
                        return await setRoles({
                          userId: user.id,
                          roles: roleIds.filter((r) => r !== role.id),
                        });
                      }
                    }}
                  />
                </Flex>
              </React.Fragment>
            ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
