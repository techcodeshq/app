import {
  Image,
  Heading,
  Text,
  HStack,
  Box,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Checkbox,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { useMutation } from "@hooks/useMutation";
import { registerAction } from "@use-gesture/react";
import { useRouter } from "next/router";

const validateOsis = z.object({
  osis: z
    .string({ required_error: "Osis is required" })
    .length(9, "Osis must be 9 letters long")
    .refine((osis) => !isNaN(+osis), "Osis must contain only numbers"),
});

export const Register: React.FC = () => {
  const { data: session, status } = useSession();
  const registerOsis = useMutation<null, { osis: string }>(
    "/users/osis",
    "patch",
  );
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        osis: "",
      }}
      validationSchema={toFormikValidationSchema(validateOsis)}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        await registerOsis(values);
        setSubmitting(false);
        router.push("/dashboard");
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <HStack my="4">
            <Image src="/logo.svg" alt="TechCodes Logo" />
            <Box pl="4">
              <Heading>Welcome to TechCodes, {session?.user.name}!</Heading>
              <Text>Let&apos;s finish setting up your account</Text>
            </Box>
          </HStack>

          <Field name="osis">
            {({ field }) => (
              <FormControl isRequired isInvalid={!!errors.osis} mb="4">
                <Input
                  {...field}
                  type="osis"
                  variant="filled"
                  placeholder="OSIS Number"
                />
                <FormErrorMessage>{errors.osis}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Button isLoading={isSubmitting} type="submit">
            Get Started!
          </Button>
        </Form>
      )}
    </Formik>
  );
};
