import { LinkDashboard } from "@modules/links/admin";
import { MemberLinkRedeem } from "@modules/links/redeem";
import { useQuery } from "@hooks/useQuery";
import { Auth } from "@modules/auth";
import { RenderIfAllowed } from "@modules/auth/permissions/render-component";
import { EventProvider } from "@modules/event/pages/context";
import { EventLink, LinkApplyInstructions, Perm } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";

const LinkPage: React.FC = () => {
  const router = useRouter();
  const { data: link } = useQuery<
    EventLink & { metadata: LinkApplyInstructions[] }
  >(`/links/code/${router.query.code}`);

  return (
    <EventProvider>
      <Auth>
        <RenderIfAllowed perms={[Perm.VIEW_EVENT_LINK]}>
          {(allowed) => {
            if (allowed) {
              return <LinkDashboard link={link} fullUrl={"http"} />;
            } else {
              return <MemberLinkRedeem link={link} />;
            }
          }}
        </RenderIfAllowed>
      </Auth>
    </EventProvider>
  );
};

export default LinkPage;
