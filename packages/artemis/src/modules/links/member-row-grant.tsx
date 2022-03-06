import { Button, GridItem, Td, Tooltip, Tr, useToast } from "@chakra-ui/react";
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

  const toast = useToast();

  return (
    <>
      <Tr>
        <BaseMemberRow user={user} showOsis={false} />
        <Td>
          <Button
            onClick={async () => {
              const res = await grant(
                { userId: user.id, linkId: link.id },
                ({ description }) => {
                  toast({
                    title: "Oh no!",
                    description,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                },
              );

              if (res) {
                toast({
                  title: "Success!",
                  description: res.statusDescription,
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
              }
            }}
          >
            Grant
          </Button>
        </Td>
      </Tr>
    </>
  );
};
