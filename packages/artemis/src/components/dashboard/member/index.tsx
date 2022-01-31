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
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
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
} from "@typings";
import { Field, Form, Formik } from "formik";
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
            <Grid templateColumns="repeat(2, 1fr)">
              <GridItem fontWeight="600">Key</GridItem>
              <GridItem fontWeight="600">Value</GridItem>
              {data &&
                data.metadata.map((md) => (
                  <React.Fragment key={md.key}>
                    <GridItem>{md.key}</GridItem>
                    <GridItem>
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
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Divider />
                    </GridItem>
                  </React.Fragment>
                ))}
            </Grid>
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
            <Grid templateColumns="repeat(4, 1fr)">
              <GridItem fontWeight="600">Link</GridItem>
              <GridItem fontWeight="600">Key</GridItem>
              <GridItem fontWeight="600">Value</GridItem>
              <GridItem fontWeight="600">Redeemed On</GridItem>
              {data &&
                data.links.map((link) =>
                  link.eventLink.metadata.map((m, index) => (
                    <React.Fragment key={index}>
                      <GridItem
                        color={actionBasedValue(m.action, [
                          "green.200",
                          "red.300",
                          null,
                        ])}
                      >
                        {m.eventLink.name}
                      </GridItem>
                      <GridItem
                        color={actionBasedValue(m.action, [
                          "green.200",
                          "red.300",
                          null,
                        ])}
                      >
                        {m.key}
                      </GridItem>
                      <GridItem
                        color={actionBasedValue(m.action, [
                          "green.200",
                          "red.300",
                          null,
                        ])}
                      >
                        {actionBasedValue(m.action, ["+", "-", "="])}
                        {m.value}
                      </GridItem>
                      <GridItem
                        color={actionBasedValue(m.action, [
                          "green.200",
                          "red.300",
                          null,
                        ])}
                      >
                        {new Date(link.createdAt).toLocaleDateString() +
                          " at " +
                          new Date(link.createdAt).toLocaleTimeString()}
                      </GridItem>
                      <GridItem colSpan={4}>
                        <Divider />
                      </GridItem>
                    </React.Fragment>
                  )),
                )}
            </Grid>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};
