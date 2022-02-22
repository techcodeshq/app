import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { Branch } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import React from "react";

interface CreateBranchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBranch: React.FC<CreateBranchProps> = ({
  isOpen,
  onClose,
}) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const create = useMutation<Branch, Partial<Branch>>(
    "/branches",
    "post",
    `/branches`,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent bgColor={bgColor}>
        <ModalHeader>Create Branch</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            name: "",
          }}
          onSubmit={async (values) => {
            await create({
              ...values,
            });
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalBody>
                <Stack spacing={4}>
                  <Field name="name">
                    {({ field }) => (
                      <FormControl isRequired>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Branch Name"
                          variant="filled"
                          autoComplete="off"
                        />
                      </FormControl>
                    )}
                  </Field>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button width="30%" type="submit" isLoading={isSubmitting}>
                  Create
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
