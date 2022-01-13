import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { validateOsis } from "@lib/util/validateOsis";
import { User } from "@typings";
import { Field, Form, Formik } from "formik";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

interface RegisterProps {
  user: User;
}

const Register: React.FC<RegisterProps> = ({ user }) => {
  const router = useRouter();
  const register = useMutation<User, { osis: string }>(
    "/auth/registerOsis",
    "patch"
  );

  return (
    <>
      <Head>
        <title>Register | TechCodes</title>
      </Head>
      <Flex height="100vh" alignItems="center">
        <Stack width="45vmax" margin="auto" spacing={10}>
          <Flex alignItems="center">
            <Image src="/logo.svg" alt="logo" width="64rem" height="64rem" />
            <Box ml="1rem">
              <Heading
                as="h1"
                fontSize="min(2.5vmax, 2.5rem)"
                fontWeight="bold"
              >
                Welcome to TechCodes, {user.name.split(" ")[0]}!
              </Heading>
              <Heading
                as="h2"
                fontSize="min(1.8vmax, 1.8rem)"
                fontWeight="regular"
              >
                Let's finish setting up your account
              </Heading>
            </Box>
          </Flex>
          <Formik
            initialValues={{ osis: "" }}
            onSubmit={async ({ osis }, { setErrors }) => {
              const data = await register(
                {
                  osis,
                },
                (error) => setErrors({ osis: error.description })
              );

              if (data.osis) {
                router.push((router.query.callback as string) || "/");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Stack spacing={8}>
                  <Field name="osis" validate={validateOsis}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.osis &&
                          form.touched.osis &&
                          form.values.osis
                        }
                      >
                        <Input
                          {...field}
                          id="osis"
                          placeholder="OSIS Number"
                          variant="filled"
                          autoComplete="off"
                        />
                        <FormErrorMessage>{form.errors.osis}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Button width="8rem" type="submit" isLoading={isSubmitting}>
                    Get Started
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
      </Flex>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  if (!session?.user.osis) return { props: { user: session?.user } };
  return {
    redirect: {
      destination: context.query.callback || "/",
      permanent: false,
    },
  };
};

export default Register;
