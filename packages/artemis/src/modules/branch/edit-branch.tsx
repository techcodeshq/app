import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { DeleteItem } from "@components/shared/delete-item";
import { useIsMobile } from "@hooks/useIsMobile";
import { useMutation } from "@hooks/useMutation";
import { Branch } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useBranch } from "./pages/context";

export const BranchInfoSettings = () => {
  const isMobile = useIsMobile();
  const largeScreen = useBreakpointValue({ base: true, lg: false });
  const { branch } = useBranch();
  const router = useRouter();
  const save = useMutation<Branch, { id: string; data: Partial<Branch> }>(
    "/branches",
    "patch",
    `/branches/${branch.slug}`,
  );

  return (
    <Flex flexDir="column" gap="1rem" h="90vh">
      <Flex flexDir="column" flex="1" gap="1rem">
        <Flex alignItems="center" justifyContent="space-between">
          <Box>
            <Heading fontWeight="medium" fontSize="1.5rem">
              Branch Overview
            </Heading>
            {!largeScreen && <Text opacity="50%">Edit branch information</Text>}
          </Box>
        </Flex>
        <Divider />
      </Flex>
      <Flex
        h="100%"
        w="100%"
        overflow={{ base: null, md: "auto" }}
        gap={isMobile ? null : "1rem"}
        flexDir={largeScreen ? "column" : "row"}
      >
        <Box w="100%">
          <Formik
            initialValues={{ name: branch.name }}
            enableReinitialize={true}
            onSubmit={async ({ name }) => {
              const data = await save({ id: branch.id, data: { name } });
              router.push(`/branch/${data.slug}/events`);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Stack spacing={8}>
                  <Field name="name">
                    {({ field }) => (
                      <FormControl>
                        <FormLabel>Branch Name</FormLabel>
                        <Input
                          {...field}
                          id="name"
                          variant="filled"
                          autoComplete="off"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Flex justifyContent="space-between">
                    <Button type="submit" isLoading={isSubmitting}>
                      Save
                    </Button>
                    <DeleteItem
                      url={`/branches/${branch.id}`}
                      itemName={branch.name}
                      warningText="Are you sure you want to delete this branch?"
                      refetchUrl=""
                      postDelete={async () => {
                        router.push("/dashboard/branches");
                      }}
                      deps={[branch]}
                    >
                      {(onOpen) => (
                        <Button
                          bgColor="red.500"
                          onClick={onOpen}
                          label={`Delete ${branch.name}`}
                          _hover={{ bgColor: "red.600" }}
                          placement="bottom"
                        >
                          Delete
                        </Button>
                      )}
                    </DeleteItem>
                  </Flex>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Flex>
  );
};
