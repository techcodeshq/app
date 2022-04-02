import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Field, FieldArray, Formik, Form as FormikForm } from "formik";

const formData = {
  name: "Register",
  questions: ["Name", "Birthday"],
};

export const Form = () => {
  return (
    <Box
      w={{ base: null, md: "50%" }}
      m="0 auto"
      p="2rem"
      as={Stack}
      spacing="2rem"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Heading fontWeight="medium">{formData.name}</Heading>
        <Image src="logo.svg" w="2.5rem" h="2.5rem" />
      </Flex>
      <Divider />
      <Formik
        initialValues={{
          questions: formData.questions.map((question) => ({
            question,
            response: "",
          })),
        }}
        onSubmit={(values) => console.log(values)}
      >
        {({ values }) => (
          <FormikForm>
            <Box mb="2rem">
              <FieldArray
                name="questions"
                render={(arrayHelpers) => (
                  <Stack spacing="1.5rem">
                    {values.questions.map(({ question }, index) => (
                      <FormControl>
                        <FormLabel fontSize="1.2rem">{question}</FormLabel>
                        <Field name={`questions[${index}].response`}>
                          {({ field }) => (
                            <Input
                              {...field}
                              variant="filled"
                              placeholder={question}
                            />
                          )}
                        </Field>
                      </FormControl>
                    ))}
                  </Stack>
                )}
              />
            </Box>
            <Button type="submit">Join</Button>
          </FormikForm>
        )}
      </Formik>
    </Box>
  );
};
