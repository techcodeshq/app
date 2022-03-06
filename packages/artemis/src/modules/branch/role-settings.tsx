import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { DeleteItem } from "@components/delete-item";
import { useIsMobile } from "@hooks/useIsMobile";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import { Role } from "@prisma/client";
import { TooltipButton } from "@ui/tooltip-button";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useBranch } from "./pages/context";
import { RolePerms } from "./role-perms";

export const BranchRoleSettings: React.FC = () => {
  const { branch } = useBranch();
  const { data: roles } = useQuery<Role[]>(`/branches/${branch.id}/roles`);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const create = useMutation<Role, { name: string; branchId: string }>(
    "/roles",
    "post",
    `/branches/${branch.id}/roles`,
  );
  const edit = useMutation<Role, { name: string; roleId: string }>(
    "/roles",
    "patch",
    `/branches/${branch.id}/roles`,
  );
  const isMobile = useIsMobile();
  const largeScreen = useBreakpointValue({ base: true, lg: false });

  useEffect(() => {
    if (!selectedRole && roles) return setSelectedRole(roles[0]);
    if (selectedRole) {
      setSelectedRole(roles.find((role) => role.id === selectedRole.id));
    }
  }, [roles]);

  return (
    <Flex flexDir="column" gap="1rem" h="90vh">
      <Flex flexDir="column" flex="1" gap="1rem">
        <Flex alignItems="center" justifyContent="space-between">
          <Box>
            <Heading fontWeight="medium" fontSize="1.5rem">
              Roles
            </Heading>
            {!largeScreen && (
              <Text opacity="50%">
                Use roles to organise your branch members and customise their
                permissions
              </Text>
            )}
          </Box>
          <Button
            minW="6rem"
            onClick={async () => {
              const role = await create({
                name: "new role",
                branchId: branch.id,
              });
              setSelectedRole(role);
            }}
          >
            Create
          </Button>
        </Flex>
        <Divider />
      </Flex>
      <Flex
        overflow={{ base: null, md: "auto" }}
        flex="8"
        gap={isMobile ? null : "1rem"}
        flexDir={largeScreen ? "column" : "row"}
      >
        <Flex flex="1">
          {roles && (
            <>
              {largeScreen && (
                <>
                  <Select
                    onChange={(event) => {
                      setSelectedRole(
                        roles.find((role) => role.id == event.target.value),
                      );
                    }}
                  >
                    {roles.map((role) => (
                      <option value={role.id}>{role.name}</option>
                    ))}
                  </Select>
                </>
              )}
              {!largeScreen && (
                <Stack w="100%" h="100%" overflow="auto" pr="1rem">
                  {roles.map((role) => (
                    <Box
                      p="0.8rem"
                      _hover={{ cursor: "pointer" }}
                      borderRadius="0.5rem"
                      bgColor={selectedRole === role ? "bg.700" : null}
                      onClick={() => setSelectedRole(role)}
                    >
                      {role.name}
                    </Box>
                  ))}
                </Stack>
              )}
            </>
          )}
        </Flex>
        <Divider orientation="vertical" />
        <Flex flex="2" p={isMobile ? "1rem 0" : "1rem"} flexDir="column">
          {selectedRole && (
            <Stack overflow="auto" pr="1rem" spacing="1rem">
              <Flex alignItems="center" justifyContent="space-between">
                <Heading fontWeight="normal" fontSize="1.2rem">
                  Edit Role - {selectedRole.name}
                </Heading>
                <DeleteItem
                  url={`/roles/${selectedRole.id}`}
                  itemName={selectedRole.name}
                  warningText="Are you sure you want to delete this role?"
                  postDelete={async () => {}}
                  refetchUrl={`/branches/${branch.id}/roles`}
                  deps={[selectedRole]}
                >
                  {(onOpen) => (
                    <TooltipButton
                      bgColor="bg.600"
                      onClick={onOpen}
                      label={`Delete ${selectedRole.name}`}
                      _hover={{ bgColor: "red.400" }}
                      icon={<DeleteIcon />}
                      placement="bottom"
                    />
                  )}
                </DeleteItem>
              </Flex>
              <Divider />
              <Formik
                initialValues={{ name: selectedRole.name }}
                enableReinitialize={true}
                onSubmit={async ({ name }) => {
                  await edit({ roleId: selectedRole.id, name });
                }}
              >
                <Form>
                  <Stack spacing={8}>
                    <Field name="name">
                      {({ field }) => (
                        <FormControl>
                          <FormLabel>Name</FormLabel>
                          <Input
                            {...field}
                            id="name"
                            variant="filled"
                            autoComplete="off"
                          />
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                </Form>
              </Formik>
              <Divider />
              <RolePerms role={selectedRole} />
            </Stack>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
