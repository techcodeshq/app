import {
  ModalBody,
  Stack,
  FormLabel,
  Input,
  Textarea,
  ModalFooter,
  Button,
  FormControl,
} from "@chakra-ui/react";
import { Form, Field } from "formik";

export const TaskForm: React.FC<{ isSubmitting: boolean }> = ({
  isSubmitting,
}) => (
  <Form>
    <ModalBody>
      <Stack spacing={4}>
        <Field name="name">
          {({ field }) => (
            <FormControl isRequired>
              <FormLabel>Task Name</FormLabel>
              <Input
                {...field}
                id="name"
                placeholder="Contact Sponsors..."
                variant="filled"
                autoComplete="off"
              />
            </FormControl>
          )}
        </Field>
        <Field name="description">
          {({ field }) => (
            <FormControl isRequired>
              <FormLabel>Task Description</FormLabel>
              <Textarea
                {...field}
                size="lg"
                id="description"
                placeholder="Make sure to let them we're great!"
                variant="filled"
                autoComplete="off"
              />
            </FormControl>
          )}
        </Field>
        <Field name="dueDate">
          {({ field }) => (
            <FormControl isRequired>
              <FormLabel>Due Date</FormLabel>
              <Input
                {...field}
                type="datetime-local"
                id="dueDate"
                variant="filled"
              />
            </FormControl>
          )}
        </Field>
      </Stack>
    </ModalBody>
    <ModalFooter>
      <Button width="30%" type="submit" isLoading={isSubmitting}>
        Finish
      </Button>
    </ModalFooter>
  </Form>
);
