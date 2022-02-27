import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  Sidebar,
  SidebarBottom,
  SidebarTop,
  Topbar,
  TopbarLeft,
  TopbarRight,
} from "@ui/sidebar";
import { Layout } from "@components/shared/layout";
import { useMutation } from "@hooks/useMutation";
import {
  EventLinkRedeem,
  EventLinkRedeemStatus,
  KeyValueAction,
  User,
  UserMetadata,
} from "@prisma/client";
import { Field, Form, Formik } from "formik";
import React from "react";
import { MemberData } from "./member-data";
import { MemberDataMobile } from "./member-data-mobile";

export type Return = {
  metadata: UserMetadata[] | undefined;
  links:
    | {
        createdAt: string;
        eventLink: {
          metadata: {
            value: number;
            action: KeyValueAction;
            key: string;
            eventLink: {
              name: string;
            };
          }[];
        };
      }[]
    | undefined;
};

type MemberDashboardViewProps = {
  route: string;
  user: User;
  isExec?: boolean;
};

export const MemberDashboardView: React.FC<MemberDashboardViewProps> = ({
  route,
  user,
  isExec,
}) => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const redeem = useMutation<EventLinkRedeem, { code: string }>(
    "/links/redeem",
    "post",
    route,
  );

  return (
    <Layout title="User">
      {isMobile ? (
        <Topbar>
          <TopbarLeft />
          <TopbarRight />
        </Topbar>
      ) : (
        <Sidebar>
          <SidebarTop />
          <SidebarBottom />
        </Sidebar>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        {isExec ? (
          <Box>
            <Heading>{user.name}</Heading>
            <Flex gap="1rem">
              <Text>{user.osis}</Text>
              <Text>{user.email}</Text>
            </Flex>
          </Box>
        ) : (
          <Heading>Welcome, {user.name}</Heading>
        )}
        {!isExec ? (
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
        ) : (
          <Avatar src={user.image} />
        )}
      </Flex>
      {isMobile && <Divider mt="1rem" />}
      {!isMobile ? (
        <MemberData user={user} route={route} />
      ) : (
        <MemberDataMobile route={route} user={user} />
      )}
    </Layout>
  );
};
