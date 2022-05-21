import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  Text,
  FormControl,
  Flex,
  Input,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { Error } from "@hooks/useMutation";
import { Field, Form, Formik } from "formik";

export const ConfirmDelete: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (body: any, handleError?: (error: Error) => any) => Promise<any>;
  confirmKey: string;
  warningText: string;
  preDelete?: () => Promise<void>;
  postDelete?: () => Promise<void>;
}> = ({
  isOpen,
  onClose,
  onSubmit,
  confirmKey,
  warningText,
  preDelete,
  postDelete,
}) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const toast = useToast();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bgColor={bgColor}>
        <ModalHeader>Please Confirm!</ModalHeader>
        <ModalBody>
          <Text marginBottom={5}>{warningText}</Text>
          <Text marginBottom={1.5}>To confirm type &quot;{confirmKey}&quot;</Text>
          <Formik
            initialValues={{ confirmation: "" }}
            onSubmit={async () => {
              if (preDelete) await preDelete();
              const res = await onSubmit({}, ({ description }) => {
                toast({
                  title: "Failed to Delete",
                  description,
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
              });
              if (postDelete && res) await postDelete();

              onClose();
            }}
          >
            {(props) => (
              <Form>
                <Field
                  name="confirmation"
                  validate={(confirmation: string) => {
                    if (confirmation !== confirmKey) {
                      return "Did not type the correct confirmation";
                    }
                  }}
                >
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.confirmation && form.touched.confirmation
                      }
                    >
                      <Flex>
                        <Input
                          {...field}
                          id="confirmation"
                          borderRightRadius={0}
                          variant="filled"
                        />
                        <Button
                          bgColor="red.300"
                          _hover={{
                            bgColor: "red.400",
                          }}
                          color={bgColor}
                          isLoading={props.isSubmitting}
                          type="submit"
                          borderLeftRadius={0}
                        >
                          Delete
                        </Button>
                      </Flex>
                      <FormErrorMessage>
                        {form.errors.confirmation}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
