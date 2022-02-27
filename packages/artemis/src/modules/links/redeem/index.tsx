import {
  Box,
  Button,
  Center,
  Flex,
  Table,
  Heading,
  Tbody,
  Th,
  Thead,
  Tr,
  Stack,
  Text,
} from "@chakra-ui/react";
import LinkRedeemFail from "@modules/links/redeem/link-redeem-fail";
import LinkRedeemSuccess from "@modules/links/redeem/link-redeem-success";
import { useMutation } from "@hooks/useMutation";
import {
  EventLink,
  EventLinkRedeem,
  EventLinkRedeemStatus,
  LinkApplyInstructions,
} from "@prisma/client";
import { Session } from "next-auth";
import React, { useState } from "react";
import { LinkActions } from "../link-actions";

interface LinkPageProps {
  link: EventLink & { metadata: LinkApplyInstructions[] };
}

export const MemberLinkRedeem: React.FC<LinkPageProps> = ({ link }) => {
  const [responseData, setResponseData] = useState<EventLinkRedeem>(null);
  const [redeemed, setRedeemed] = useState(false);
  const [error, setError] = useState("");
  const redeem = useMutation<EventLinkRedeem, { code: string }>(
    "/links/redeem",
    "post",
    "/users/metadata",
  );

  return (
    <>
      {redeemed ? (
        <Box>
          {error && <LinkRedeemFail error={error} />}
          {responseData && <LinkRedeemSuccess link={link} />}
        </Box>
      ) : (
        <Center h="100vh">
          <Stack spacing="1rem" maxW="80%">
            <Box>
              <Heading fontWeight="normal">Redeem Link: {link.name}</Heading>
              <Text opacity="50%">
                Redeeming this link will make the following changes to your
                statistics.
              </Text>
            </Box>
            <Flex
              flexDir="column"
              flex="1"
              bgColor="bg.700"
              borderRadius="0.4rem"
              overflow="auto"
            >
              <Heading
                p="1.5rem 1.5rem 0 1.5rem"
                fontSize="1.5rem"
                fontWeight="normal"
              >
                Actions
              </Heading>
              <Table size="lg">
                <Thead>
                  <Tr>
                    <Th>Key</Th>
                    <Th>Value</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {link.metadata &&
                    link.metadata.map((md) => <LinkActions metadata={md} />)}
                </Tbody>
              </Table>
            </Flex>
            <Button
              onClick={() => {
                redeem({ code: link.code }, (error) =>
                  setError(error.description),
                ).then((data) => {
                  setRedeemed(true);
                  if (data?.status === EventLinkRedeemStatus.FAILED)
                    return setError(data.statusDescription);
                  return setResponseData(data);
                });
              }}
            >
              Redeem
            </Button>
          </Stack>
        </Center>
      )}
    </>
  );
};
