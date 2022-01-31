import { LinkDashboard } from "@components/event/executive/link-dashboard";
import { MemberLinkRedeem } from "@components/event/member";
import { useQuery } from "@hooks/useQuery";
import { getAxios } from "@lib/axios";
import { withOsisRedirect } from "@lib/util/osisRedirect";
import { EventLink, LinkApplyInstructions, Role } from "@typings";
import { Session } from "next-auth";
import React from "react";

interface LinkPageProps {
  session: Session;
  code: string;
  fullUrl: string;
  fallback: EventLink & { metadata: LinkApplyInstructions[] };
}

const LinkPage: React.FC<LinkPageProps> = ({
  session,
  fallback,
  code,
  fullUrl,
}) => {
  const { data: link } = useQuery<
    EventLink & { metadata: LinkApplyInstructions[] }
  >(`/links/code/${code}`, {
    fallbackData: fallback,
  });

  switch (session.user.role) {
    case Role.EXEC:
      return <LinkDashboard link={link} fullUrl={fullUrl} />;
    case Role.MEMBER:
      return <MemberLinkRedeem session={session} link={link} code={code} />;
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
        fullUrl: (process.env.NEXTAUTH_URL + context.resolvedUrl).split("?")[0],
        code: context.params.code,
        fallback: res.data,
      },
    };
  },
);

export default LinkPage;
