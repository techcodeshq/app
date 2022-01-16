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
} from "@components/nav/base-sidebar";
import { Layout } from "@components/shared/layout";
import { useMutation } from "@hooks/useMutation";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { validateOsis } from "@lib/util/validateOsis";
import { User } from "@typings";
import { Field, Form, Formik } from "formik";
import { NextPage } from "next";

const Settings: NextPage<{ user: User }> = ({ user }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue("bg.50", "bg.800");
  const itemBgColor = useColorModeValue("bg.100", "bg.700");
  const changeOsis = useMutation<User, { osis: string }>(
    "/auth/registerOsis",
    "patch"
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
                <Text>OSIS: {user.osis}</Text>
              </Stack>
            </Box>
            {!isMobile && <Avatar src={user.image} size="lg" />}
          </Flex>
        </Box>
        <Box p="2rem 0" bgColor={itemBgColor} mt="2rem">
          <Box p="0 1.5rem">
            <Heading fontWeight="500" fontSize="1.8rem" mb="0.5rem">
              Update Osis
            </Heading>
            <Formik
              initialValues={{ osis: user.osis }}
              onSubmit={async ({ osis }, { setErrors }) => {
                const res = await changeOsis({ osis }, ({ description }) => {
                  setErrors({ osis: description });
                });

                if (res) {
                  window.location.reload();
                }
              }}
            >
              {(props) => (
                <Form>
                  <Field name="osis" validate={validateOsis}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.osis && form.touched.osis}
                      >
                        <FormLabel>Osis</FormLabel>
                        <Flex>
                          <Input
                            {...field}
                            id="osis"
                            borderRightRadius={0}
                            variant="filled"
                            placeholder="New Osis"
                          />
                          <Button
                            isLoading={props.isSubmitting}
                            type="submit"
                            borderLeftRadius={0}
                          >
                            Update
                          </Button>
                        </Flex>
                        <FormErrorMessage>{form.errors.osis}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = withOsisRedirect(({ session }) => {
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { user: session.user } };
});

export default Settings;
