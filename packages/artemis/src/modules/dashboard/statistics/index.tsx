import {
  Flex,
  Input,
  FormErrorMessage,
  Button,
  FormControl,
} from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { EventLinkRedeem, EventLinkRedeemStatus } from "@prisma/client";
import { TabHeading } from "@ui/tab-heading";
import { Formik, Form, Field } from "formik";
import { DashboardLayout } from "../layout";
import { BranchMetadataTabs } from "./branch-tabs";

export const DashboardStatisticsView: React.FC = () => {
  const redeem = useMutation<EventLinkRedeem, { code: string }>(
    "/links/redeem",
    "post",
  );

  return (
    <DashboardLayout>
      <TabHeading heading="Statistics">
        <Formik
          initialValues={{ code: "" }}
          onSubmit={async ({ code }, { setErrors, setValues }) => {
            const res = await redeem({ code }, ({ description }) => {
              setErrors({ code: description });
            });

            if (res.status && res.status === EventLinkRedeemStatus.FAILED) {
              setErrors({ code: res.statusDescription });
            }

            setValues({ code: "" });
          }}
        >
          {(props) => (
            <Form>
              <Flex>
                <Field name="code">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.code && form.touched.code}
                    >
                      <Input
                        {...field}
                        id="code"
                        placeholder="Link Code"
                        borderRightRadius="0"
                      />
                      <FormErrorMessage>{form.errors.code}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  isLoading={props.isSubmitting}
                  type="submit"
                  borderLeftRadius="0"
                >
                  Redeem
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </TabHeading>
      <BranchMetadataTabs />
    </DashboardLayout>
  );
};
