import {
  ModalBody,
  Stack,
  FormLabel,
  Input,
  Textarea,
  ModalFooter,
  Button,
  FormControl,
  InputLeftAddon,
  InputGroup,
} from "@chakra-ui/react";
import { Form, Field } from "formik";

const generateDate = (current: Date, showSeconds = false) => {
  const date = new Date(current);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, showSeconds ? -8 : -1);
};

export const TaskForm: React.FC<{
  isSubmitting: boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}> = ({ isSubmitting, setFieldValue }) => (
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
                placeholder="Make sure it's detailed!"
                variant="filled"
                autoComplete="off"
              />
            </FormControl>
          )}
        </Field>
        <Field name="dueDate">
          {({ field }) => (
            <FormControl>
              <FormLabel>Due Date</FormLabel>
              <InputGroup>
                <InputLeftAddon
                  as={Button}
                  onClick={async () => {
                    const today = await new Date();
                    today.setHours(23, 59);
                    setFieldValue("dueDate", generateDate(today, true));
                  }}
                  children="Tonight"
                />
                <Input
                  {...field}
                  type="datetime-local"
                  id="dueDate"
                  variant="filled"
                />
              </InputGroup>
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
