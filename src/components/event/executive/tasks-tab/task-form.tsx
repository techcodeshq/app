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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
                    setFieldValue("dueDate", today);
                  }}
                  children="Today"
                />
                <Input
                  {...field}
                  as={DatePicker}
                  id="dueDate"
                  variant="filled"
                  autoComplete="off"
                  name="dueDate"
                  selected={(field.value && new Date(field.value)) || null}
                  onChange={(val) => {
                    setFieldValue(field.name, val);
                  }}
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
