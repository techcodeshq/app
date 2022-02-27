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
} from "@chakra-ui/react";
import LinkRedeemFail from "@components/event/member/link-redeem-fail";
import LinkRedeemSuccess from "@components/event/member/link-redeem-success";
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
  session: Session;
  code: string;
  link: EventLink & { metadata: LinkApplyInstructions[] };
  redeem: boolean;
}

export const MemberLinkRedeem: React.FC<LinkPageProps> = ({ link, code }) => {
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
        <Box height="100vh">
          <Stack width="50%" height="50%" margin="25vh auto">
            <Flex
              flexDir="column"
              flex="1"
              bgColor="bg.700"
              borderRadius="0.4rem"
              overflow="auto"
              width={{ base: "100%", md: null }}
            >
              <Heading p="1.5rem 1.5rem 0 1.5rem" fontSize="1.5rem">
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
                redeem({ code }, (error) => setError(error.description)).then(
                  (data) => {
                    setRedeemed(true);
                    if (data?.status === EventLinkRedeemStatus.FAILED)
                      return setError(data.statusDescription);
                    return setResponseData(data);
                  },
                );
              }}
            >
              Redeem
            </Button>
          </Stack>
        </Box>
      )}
    </>
  );
};
