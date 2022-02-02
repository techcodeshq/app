import {
  Box,
  Button,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormErrorMessage,
  GridItem,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { LinkActions } from "@components/event/link-actions";
import {
  Sidebar,
  SidebarBottom,
  SidebarTop,
  Topbar,
  TopbarLeft,
  TopbarRight,
} from "@components/nav/base-sidebar";
import { Layout } from "@components/shared/layout";
import { Grid } from "@components/ui/grid";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import { actionBasedValue } from "@lib/util/actionBasedValue";
import {
  EventLinkRedeem,
  EventLinkRedeemStatus,
  KeyValueAction,
  User,
  UserMetadata,
} from "@prisma/client";
import { Field, Form, Formik } from "formik";
import link from "next/link";
import React from "react";

type Return = {
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
  const boxColor = useColorModeValue("bg.100", "bg.800");
  const { data } = useQuery<Return>(route);
  const redeem = useMutation<EventLinkRedeem, { code: string }>(
    "/links/redeem",
    "post",
    route,
  );
  const edit = useMutation<
    UserMetadata,
    { key: string; userId: string; value: number }
  >("/users/metadata", "patch", route);

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
        {!isExec && (
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
        )}
      </Flex>
      <Flex
        pt="2rem"
        gap="2rem"
        overflow="auto"
        height="100%"
        width={{ base: null, md: "100%" }}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Flex flex="0.5">
          <Box
            bgColor={boxColor}
            borderRadius="0.4rem"
            width={{ base: "100%", md: null }}
            overflow="auto"
            minH="100%"
          >
            <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
              Statistics
            </Heading>
            <Table size="lg">
              <Thead>
                <Tr>
                  <Th>Key</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data &&
                  data.metadata.map((md) => (
                    <Tr key={md.key}>
                      <Td>{md.key}</Td>
                      <Td>
                        <Editable
                          defaultValue={md.value.toString()}
                          onSubmit={async (value) => {
                            await edit({
                              userId: user.id,
                              key: md.key,
                              value: parseInt(value),
                            });
                          }}
                        >
                          <EditablePreview />
                          <EditableInput />
                        </Editable>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        </Flex>
        <Flex flex="1">
          <Box
            bgColor={boxColor}
            borderRadius="0.4rem"
            overflow="auto"
            minH="100%"
            width={{ base: "100%", md: null }}
          >
            <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
              History
            </Heading>
            <Table size="lg">
              <Thead>
                <Tr>
                  <Th>Link</Th>
                  <Th>Key</Th>
                  <Th>Value</Th>
                  <Th>Redeemed</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data &&
                  data.links.map((link) =>
                    link.eventLink.metadata.map((m, index) => (
                      <Tr key={index}>
                        <Td
                          color={actionBasedValue(m.action, [
                            "green.200",
                            "red.300",
                            null,
                          ])}
                        >
                          {m.eventLink.name}
                        </Td>
                        <Td
                          color={actionBasedValue(m.action, [
                            "green.200",
                            "red.300",
                            null,
                          ])}
                        >
                          {m.key}
                        </Td>
                        <Td
                          color={actionBasedValue(m.action, [
                            "green.200",
                            "red.300",
                            null,
                          ])}
                        >
                          {actionBasedValue(m.action, ["+", "-", "="])}
                          {m.value}
                        </Td>
                        <Td
                          color={actionBasedValue(m.action, [
                            "green.200",
                            "red.300",
                            null,
                          ])}
                        >
                          {new Date().toLocaleString()}
                        </Td>
                      </Tr>
                    )),
                  )}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};
