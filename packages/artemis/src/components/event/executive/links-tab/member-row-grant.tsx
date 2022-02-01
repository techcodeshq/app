import { Button, GridItem, Td, Tooltip, Tr } from "@chakra-ui/react";
import { BaseMemberRow } from "@components/shared/member-row-base";
import { useMutation } from "@hooks/useMutation";
import { EventLink, EventLinkRedeem, User } from "@prisma/client";
import { useState } from "react";

export const MemberGrantRow: React.FC<{ user: User; link: EventLink }> = ({
  user,
  link,
}) => {
  const grant = useMutation<
    EventLinkRedeem,
    { linkId: string; userId: string }
  >("/links/grant", "post", "/users");

  const [grantLabel, setGrantLabel] = useState("Grant link");

  return (
    <>
      <Tr>
        <BaseMemberRow user={user} />
        <Td>
          <Tooltip label={grantLabel} placement="bottom" closeOnClick={false}>
            <Button
              onClick={async () => {
                const res = await grant(
                  { userId: user.id, linkId: link.id },
                  ({ description }) => {
                    setGrantLabel(description);
                  },
                );

                if (res) {
                  setGrantLabel(res.statusDescription);
                }
              }}
            >
              Grant
            </Button>
          </Tooltip>
        </Td>
      </Tr>
    </>
  );
};
