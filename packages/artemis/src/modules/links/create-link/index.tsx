import { MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import {
  EventLink,
  KeyValueAction,
  LinkApplyInstructions,
} from "@prisma/client";
import { Field, FieldArray, Form, Formik } from "formik";
import { CheckboxSingleControl, SelectControl } from "formik-chakra-ui";
import React from "react";
import { BsPlusLg } from "react-icons/bs";
import { useEvent } from "src/modules/event/pages/context";
import { KeyInput } from "./key-autocomplete";

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: {
    name: string;
    uses?: string;
    actions: {
      key: string;
      value: string;
      action: KeyValueAction;
    }[];
  };
}

export const CreateLink: React.FC<CreateEventProps> = ({
  isOpen,
  onClose,
  initialValues = {
    name: "",
    uses: null,
    actions: [
      {
        key: "",
        value: "",
        action: "INCREMENT",
      },
    ],
  },
}) => {
  const bgColor = useColorModeValue("bg.50", "bg.800");
  const actionBgColor = useColorModeValue("bg.100", "bg.700");
  const borderBottom = useColorModeValue("bg.200", "black");
  const { event } = useEvent();
  const create = useMutation<
    EventLink,
    Partial<EventLink & { instructions: LinkApplyInstructions[] }>
  >("/links", "post", `/links/${event.id}`);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent bgColor={bgColor}>
        <ModalHeader
          fontSize="1.8rem"
          fontWeight="600"
          borderBottom="2px solid"
          borderBottomColor={borderBottom}
          display="flex"
          justifyContent="space-between"
          mb="2rem"
        >
          Create Link
          <ModalCloseButton position="relative" />
        </ModalHeader>
        <ModalBody p={{ base: "0", md: "0 15rem" }}>
          <Box>
            <Formik
              initialValues={initialValues}
              onSubmit={async (values, { setErrors }) => {
                const data = await create(
                  {
                    name: values.name,
                    eventId: event.id,
                    uses: values.uses ? parseInt(values.uses) : null,
                    instructions: values.actions.map((action) => ({
                      ...action,
                      value: parseInt(action.value),
                    })) as LinkApplyInstructions[],
                  },
                  (error) =>
                    setErrors({
                      actions: error.description,
                    }),
                );
                if (data) {
                  onClose();
                }
              }}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                  <ModalBody>
                    <Stack spacing={6}>
                      <Heading fontSize="1.5rem" fontWeight="500">
                        Information
                      </Heading>
                      <Field name="name">
                        {({ field }) => (
                          <FormControl isRequired>
                            <FormLabel>Link Name</FormLabel>
                            <Input
                              {...field}
                              id="name"
                              placeholder="Attendance"
                              variant="filled"
                              autoComplete="off"
                              bgColor={actionBgColor}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field
                        name="uses"
                        validate={(value) => {
                          if (value !== null && value <= 0)
                            return "Link must have at least 1 use!";
                        }}
                      >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.uses && form.touched.uses}
                          >
                            <FormLabel>Uses</FormLabel>
                            <NumberInput
                              min={1}
                              variant="filled"
                              defaultValue={field.value}
                            >
                              <NumberInputField
                                bgColor={actionBgColor}
                                placeholder="Unlimited"
                                {...field}
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                            <FormErrorMessage>
                              {form.errors.uses}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <FieldArray
                        name="actions"
                        render={(arrayHelpers) => (
                          <FormControl
                            isInvalid={
                              arrayHelpers.form.errors.actions &&
                              arrayHelpers.form.touched.actions &&
                              arrayHelpers.form.values.actions
                            }
                          >
                            <Box>
                              <Flex
                                alignItems="center"
                                justifyContent="space-between"
                                p="1rem 0"
                              >
                                <Heading fontSize="1.5rem" fontWeight="500">
                                  Actions
                                </Heading>
                                <IconButton
                                  aria-label="add-action"
                                  icon={<BsPlusLg />}
                                  onClick={() => {
                                    arrayHelpers.push({
                                      key: "",
                                      action: "",
                                      value: 0,
                                    });
                                  }}
                                />
                              </Flex>
                              {values.actions.map((_, index) => (
                                <Flex
                                  key={index}
                                  justifyContent="center"
                                  flexDir="column"
                                  bgColor={actionBgColor}
                                  p="1rem"
                                  mb="1rem"
                                  borderRadius="0.5rem"
                                >
                                  <Flex mb="1rem">
                                    <Field name={`actions[${index}].key`}>
                                      {({ field }) => (
                                        <FormControl isRequired>
                                          <KeyInput
                                            name={field.name}
                                            field={field}
                                          />
                                        </FormControl>
                                      )}
                                    </Field>
                                    <IconButton
                                      onClick={() => {
                                        arrayHelpers.remove(index);
                                      }}
                                      variant="ghost"
                                      _hover={{
                                        bgColor: "red.400",
                                      }}
                                      icon={<MinusIcon />}
                                      aria-label="remove-action"
                                    />
                                  </Flex>
                                  <HStack spacing={5}>
                                    <Box width="30rem">
                                      <SelectControl
                                        name={`actions[${index}].action`}
                                        selectProps={{
                                          placeholder: "Select action",
                                          variant: "filled",
                                        }}
                                        isRequired
                                      >
                                        <option value="INCREMENT">
                                          Increment
                                        </option>
                                        <option value="DECREMENT">
                                          Decrement
                                        </option>
                                        <option value="SET">Set</option>
                                      </SelectControl>
                                    </Box>
                                    <Box width="30rem">
                                      <Field
                                        name={`actions[${index}].value`}
                                        validate={(value: number) => {
                                          if (value !== null && value < 0)
                                            return "Input must be greater than 0";
                                        }}
                                      >
                                        {({ field, form }) => (
                                          <FormControl
                                            isInvalid={
                                              form.errors.actions &&
                                              form.errors.actions[index]
                                                .value &&
                                              form.touched.actions &&
                                              form.touched.actions[index]
                                                .value &&
                                              form.values.actions
                                            }
                                            isRequired
                                          >
                                            <NumberInput
                                              min={1}
                                              defaultValue={field.value}
                                              variant="filled"
                                            >
                                              <NumberInputField
                                                placeholder="Value"
                                                {...field}
                                              />
                                              <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                              </NumberInputStepper>
                                            </NumberInput>
                                            <FormErrorMessage>
                                              {form.errors.actions &&
                                                form.errors.actions[index]
                                                  .value}
                                            </FormErrorMessage>
                                          </FormControl>
                                        )}
                                      </Field>
                                    </Box>
                                  </HStack>
                                </Flex>
                              ))}
                            </Box>
                            <FormErrorMessage>
                              {arrayHelpers.form.errors.actions}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      />
                    </Stack>
                  </ModalBody>
                  <ModalFooter display="flex" justifyContent="flex-start">
                    <Button width="5rem" type="submit" isLoading={isSubmitting}>
                      Create
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
