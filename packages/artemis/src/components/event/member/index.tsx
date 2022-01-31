import { Box } from "@chakra-ui/react";
import LinkRedeemFail from "@components/event/member/link-redeem-fail";
import LinkRedeemSuccess from "@components/event/member/link-redeem-success";
import { useMutation } from "@hooks/useMutation";
import { useAxios } from "@lib/axios";
import {
  EventLink,
  EventLinkRedeem,
  EventLinkRedeemStatus,
  LinkApplyInstructions,
  Role,
} from "@prisma/client";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";

interface LinkPageProps {
  session: Session;
  code: string;
  link: EventLink & { metadata: LinkApplyInstructions[] };
}

export const MemberLinkRedeem: React.FC<LinkPageProps> = ({
  session,
  link,
  code,
}) => {
  const { loading } = useAxios();
  const [responseData, setResponseData] = useState<EventLinkRedeem>(null);
  const [error, setError] = useState("");
  const redeem = useMutation<EventLinkRedeem, { code: string }>(
    "/links/redeem",
    "post",
    "/users/metadata",
  );

  useEffect(() => {
    if (session.user.role === Role.EXEC) return;
    if (loading) return;

    redeem({ code }, (error) => setError(error.description)).then((data) => {
      if (data?.status === EventLinkRedeemStatus.FAILED)
        return setError(data.statusDescription);
      return setResponseData(data);
    });
  }, [redeem, loading]);

  return (
    <Box>
      {error && <LinkRedeemFail error={error} />}
      {responseData && <LinkRedeemSuccess link={link} />}
    </Box>
  );
};
