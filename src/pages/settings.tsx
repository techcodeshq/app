import {
  useBreakpointValue,
  Flex,
  Text,
  FormControl,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import {
  HorizontalSidebar,
  VerticalSidebar,
} from "@components/nav/base-sidebar";
import { useMutation } from "@hooks/useMutation";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { validateOsis } from "@lib/util/validateOsis";
import { User } from "@typings";
import { Field, Form, Formik } from "formik";
import { NextPage } from "next";

const Settings: NextPage<{ user: User }> = ({ user }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const changeOsis = useMutation<User, { osis: string }>(
    "/auth/registerOsis",
    "patch"
  );
  return (
    <Flex flexDirection={{ base: "column", md: "row" }} h="100vh">
      {!isMobile ? <VerticalSidebar /> : <HorizontalSidebar />}
      <Formik
        initialValues={{ osis: user.osis }}
        onSubmit={async ({ osis }, { setErrors }) => {
          await changeOsis({ osis }, ({ description }) => {
            setErrors({ osis: description });
          });
        }}
      >
        {(props) => (
          <Form>
            <Flex>
              <Text>Osis:</Text>
              <Field name="osis" validate={validateOsis}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.osis && form.touched.osis}
                  >
                    <Input
                      {...field}
                      id="osis"
                      placeholder="New Osis"
                      borderRightRadius="0"
                    />
                    <FormErrorMessage>{form.errors.osis}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                isLoading={props.isSubmitting}
                type="submit"
                borderLeftRadius="0"
              >
                Change
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

export const getServerSideProps = withOsisRedirect(({ session }) => {
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { user: session.user } };
});

export default Settings;
