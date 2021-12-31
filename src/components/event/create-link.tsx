import { MinusIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
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
  Select,
  Text,
  Stack,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { Event, EventLink, LinkApplyInstructions } from "@typings";
import { Field, FieldArray, Form, Formik } from "formik";
import {
  CheckboxControl,
  CheckboxSingleControl,
  InputControl,
  NumberInputControl,
  SelectControl,
} from "formik-chakra-ui";
import React, { useState } from "react";
import { BsPlus, BsPlusLg } from "react-icons/bs";
import { useEvent } from "./context";
import { KeyInput } from "./key-autocomplete";

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateLink: React.FC<CreateEventProps> = ({ isOpen, onClose }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
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
        <Box width="50vmax" m="0 auto">
          <Formik
            initialValues={{
              name: "",
              uses: null,
              actions: [],
            }}
            onSubmit={async (values) => {
              await create({
                name: values.name,
                eventId: event.id,
                uses: values.uses ? parseInt(values.uses) : values.uses,
                instructions: values.actions.map((action) => ({
                  ...action,
                  value: parseInt(action.value),
                })) as LinkApplyInstructions[],
              });

              onClose();
            }}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>
                <ModalBody>
                  <Stack spacing={4}>
                    <Field name="name">
                      {({ field }) => (
                        <FormControl isRequired>
                          <Input
                            {...field}
                            id="name"
                            placeholder="Link Name"
                            variant="outline"
                            autoComplete="off"
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
                          <NumberInput min={1}>
                            <NumberInputField
                              placeholder="Uses (Unlimited)"
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
                                  public: true,
                                });
                              }}
                            />
                          </Flex>
                          {values.actions.map((_, index) => (
                            <Flex
                              key={index}
                              justifyContent="center"
                              flexDir="column"
                              bgColor="bg.700"
                              p="1rem"
                              mb="1rem"
                              borderRadius="0.5rem"
                            >
                              <Flex mb="1rem">
                                <Field name={`actions[${index}].key`}>
                                  {({ field }) => (
                                    <FormControl isRequired>
                                      <Box width="90%">
                                        <KeyInput
                                          name={field.name}
                                          setValue={setFieldValue}
                                        >
                                          <Input
                                            {...field}
                                            placeholder="Key"
                                            variant="outline"
                                            autoComplete="off"
                                          />
                                        </KeyInput>
                                      </Box>
                                    </FormControl>
                                  )}
                                </Field>
                                <IconButton
                                  onClick={() => {
                                    arrayHelpers.remove(index);
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
                                    }}
                                    isRequired
                                  >
                                    <option value="INCREMENT">Increment</option>
                                    <option value="DECREMENT">Decrement</option>
                                    <option value="SET">Set</option>
                                  </SelectControl>
                                </Box>
                                <Box width="30rem">
                                  <Field
                                    name={`actions[${index}].value`}
                                    validate={(value) => {
                                      if (value !== null && value < 0)
                                        return "Input must be greater than 0";
                                    }}
                                  >
                                    {({ field, form }) => (
                                      <FormControl
                                        isInvalid={
                                          form.errors.actions &&
                                          form.errors.actions[index].value &&
                                          form.touched.actions &&
                                          form.touched.actions[index].value &&
                                          form.values.actions
                                        }
                                        isRequired
                                      >
                                        <NumberInput min={1}>
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
                                            form.errors.actions[index].value}
                                        </FormErrorMessage>
                                      </FormControl>
                                    )}
                                  </Field>
                                </Box>
                                <CheckboxSingleControl
                                  name={`actions[${index}].public`}
                                >
                                  Public
                                </CheckboxSingleControl>
                              </HStack>
                            </Flex>
                          ))}
                        </Box>
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
      </ModalContent>
    </Modal>
  );
};
