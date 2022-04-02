import { MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useIsMobile } from "@hooks/useIsMobile";
import { Formik, FieldArray, Field, Form } from "formik";
import { BsPlusLg } from "react-icons/bs";

const form = ["un question", "un question", "un question"];

export const FormSettings: React.FC = () => {
  const isMobile = useIsMobile();
  const largeScreen = useBreakpointValue({ base: true, lg: false });
  const hasForm = true;

  return (
    <Flex flexDir="column" gap="1rem" h="90vh">
      <Flex flexDir="column" flex="1" gap="1rem">
        <Flex alignItems="center" justifyContent="space-between">
          <Box>
            <Heading fontWeight="medium" fontSize="1.5rem">
              Form Settings
            </Heading>
            {!largeScreen && <Text opacity="50%">Edit Registration Form</Text>}
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
          {!hasForm ? (
            <Center h="100%" flexDir="column" gap="1.5rem">
              <Text fontSize="1.2rem" textAlign="center">
                This branch does not have a join form! You can create one by
                pressing the button below
              </Text>
              <Button>Create</Button>
            </Center>
          ) : (
            <Formik
              initialValues={{
                questions: form,
              }}
              onSubmit={(values) => console.log(values)}
            >
              {({ values }) => (
                <Form>
                  <Box mb="2rem">
                    <FieldArray
                      name="questions"
                      render={(arrayHelpers) => (
                        <Stack spacing="1.5rem">
                          <Flex
                            alignItems="center"
                            justifyContent="space-between"
                            p="0.5rem 0"
                          >
                            <Heading fontSize="1.5rem" fontWeight="medium">
                              Questions
                            </Heading>
                            <IconButton
                              aria-label="add-question"
                              icon={<BsPlusLg />}
                              onClick={() => {
                                arrayHelpers.push("");
                              }}
                            />
                          </Flex>
                          {values.questions.map((_, index) => (
                            <Box bgColor="bg.700" p="1.5rem">
                              <FormControl>
                                <Flex
                                  alignItems="center"
                                  justifyContent="space-between"
                                >
                                  <Text>Question {index + 1}</Text>
                                  <IconButton
                                    onClick={() => {
                                      arrayHelpers.remove(index);
                                    }}
                                    variant="ghost"
                                    _hover={{
                                      bgColor: "red.400",
                                    }}
                                    icon={<MinusIcon />}
                                    aria-label="remove-question"
                                  />
                                </Flex>
                                <Field name={`questions[${index}]`}>
                                  {({ field }) => (
                                    <Input {...field} variant="filled" />
                                  )}
                                </Field>
                              </FormControl>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    />
                  </Box>
                  <Button type="submit">Join</Button>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
