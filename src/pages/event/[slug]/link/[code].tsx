import { Box } from "@chakra-ui/react";
import LinkRedeemFail from "@components/event/link-redeem-fail";
import LinkRedeemSuccess from "@components/event/link-redeem-success";
import { useMutation } from "@hooks/useMutation";
import { useQuery } from "@hooks/useQuery";
import { getAxios, useAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import {
  EventLink,
  EventLinkRedeem,
  EventLinkRedeemStatus,
  LinkApplyInstructions,
  Role,
} from "@typings";
import { Session } from "next-auth";
import React, { useContext, useEffect, useState } from "react";

interface LinkPageProps {
  session: Session;
  code: string;
  fallback: EventLink & { metadata: LinkApplyInstructions[] };
}

const LinkPage: React.FC<LinkPageProps> = ({ session, fallback, code }) => {
  const { data: link } = useQuery<
    EventLink & { metadata: LinkApplyInstructions[] }
  >(`/links/code/${code}`, {
    fallbackData: fallback,
  });
  const { loading } = useAxios();
  const [responseData, setResponseData] = useState<EventLinkRedeem>(null);
  const [error, setError] = useState("");
  const redeem = useMutation<EventLinkRedeem, { code: string }>(
    "/links/redeem",
    "post",
    "/users/metadata"
  );

  useEffect(() => {
    if (session.user.role === Role.EXEC) return;
    if (loading) return;

    const res = redeem({ code }, (error) => setError(error.description)).then(
      (data) => {
        if (data?.status === EventLinkRedeemStatus.FAILED)
          return setError(data.statusDescription);
        return setResponseData(data);
      }
    );
  }, [redeem, loading]);

  switch (session.user.role) {
    case Role.EXEC:
      return <Box>Hi Exec! This page is coming soon :)</Box>;
    case Role.MEMBER:
      return (
        <Box>
          {error && <LinkRedeemFail error={error} />}
          {responseData && <LinkRedeemSuccess link={link} />}
        </Box>
      );
  }
};

export const getServerSideProps = withOsisRedirect(
  async ({ session, context }) => {
    if (!session)
      return {
        redirect: {
          destination:
            "/auth/signin?" +
            new URLSearchParams({ callback: context.resolvedUrl }),
          permanent: false,
        },
      };

    const axios = await getAxios(context.req);
    const res = await axios.get<
      EventLink & { metadata: LinkApplyInstructions[] }
    >(`/links/code/${context.params.code}`);

    return {
      props: {
        session,
        code: context.params.code,
        fallback: {
          [`/links/${context.params.code}`]: res.data,
        },
      },
    };
  }
);

export default LinkPage;
