import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  HorizontalSidebar,
  VerticalSidebar,
} from "@components/nav/base-sidebar";
import { useQuery } from "@hooks/useQuery";
import {
  EventLinkRedeem,
  EventLinkRedeemStatus,
  KeyValueAction,
  User,
  UserMetadata,
} from "@typings";
import { actionBasedValue } from "@lib/util/actionBasedValue";
import React from "react";
import { Field, Form, Formik } from "formik";
import { useMutation } from "@hooks/useMutation";

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
    route
  );

  return (
    <Flex flexDirection={{ base: "column", md: "row" }} h="100vh">
      {isMobile ? <HorizontalSidebar /> : <VerticalSidebar />}
      <Flex w="100%" flexDir="column" flex="1">
        <Flex
          alignItems="center"
          p="2rem 2rem 0"
          justifyContent="space-between"
        >
          {isExec ? (
            <Box>
              <Heading>{user.name}</Heading>
              <Flex gap="1rem">
                <Text>{user.osis}</Text>
                <Text>{user.email}</Text>
              </Flex>
            </Box>
          ) : (
            <Heading></Heading>
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
                          <FormErrorMessage>
                            {form.errors.code}
                          </FormErrorMessage>
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
          p="2rem"
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
              <Grid
                templateColumns="repeat(2, 1fr)"
                gap="2rem"
                padding="1.5rem"
              >
                <GridItem fontWeight="600">Key</GridItem>
                <GridItem fontWeight="600">Value</GridItem>
                {data &&
                  data.metadata.map((md) => (
                    <React.Fragment key={md.key}>
                      <GridItem>{md.key}</GridItem>
                      <GridItem>{md.value}</GridItem>
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
              <Grid templateColumns="repeat(4, 1fr)" p="1.5rem" gap="2rem">
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
                            "white",
                          ])}
                        >
                          {m.eventLink.name}
                        </GridItem>
                        <GridItem
                          color={actionBasedValue(m.action, [
                            "green.200",
                            "red.300",
                            "white",
                          ])}
                        >
                          {m.key}
                        </GridItem>
                        <GridItem
                          color={actionBasedValue(m.action, [
                            "green.200",
                            "red.300",
                            "white",
                          ])}
                        >
                          {actionBasedValue(m.action, ["+", "-", "="])}
                          {m.value}
                        </GridItem>
                        <GridItem
                          color={actionBasedValue(m.action, [
                            "green.200",
                            "red.300",
                            "white",
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
                    ))
                  )}
              </Grid>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
