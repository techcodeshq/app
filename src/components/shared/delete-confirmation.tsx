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
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";

export const ConfirmDelete: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<any>;
  confirmKey: string;
}> = ({ isOpen, onClose, onSubmit, confirmKey }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bgColor={bgColor}>
        <ModalHeader>Please Confirm!</ModalHeader>
        <ModalBody>
          <Text>
            Are you absolutely sure you want to delete this user? This should
            probably only be done when trying to fix points for a user that has
            used multiple accounts.
          </Text>
          <Text>To confirm type "{confirmKey}"</Text>
          <Formik
            initialValues={{ confirmation: "" }}
            onSubmit={async () => {
              await onSubmit();

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
