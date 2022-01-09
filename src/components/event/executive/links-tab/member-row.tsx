import { Button, GridItem, Image, Text, Tooltip } from "@chakra-ui/react";
import { useMutation } from "@hooks/useMutation";
import { EventLink, EventLinkRedeem, User } from "@typings";
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
      <GridItem>
        <Image
          alignSelf="center"
          src={user.image}
          height="3rem"
          width="3rem"
          borderRadius="50%"
        />
      </GridItem>
      <GridItem alignSelf="center">
        <Text width="80%" isTruncated>
          {user.osis}
        </Text>
      </GridItem>
      <GridItem alignSelf="center">
        <Text width="10vmax" textAlign="left" isTruncated>
          {user.name}
        </Text>
      </GridItem>
      <GridItem alignSelf="center">
        <Text width="18vmax" textAlign="left" isTruncated>
          {user.email}
        </Text>
      </GridItem>
      <GridItem alignSelf="center">
        <Tooltip label={grantLabel} placement="bottom" closeOnClick={false}>
          <Button
            onClick={async () => {
              const res = await grant(
                { userId: user.id, linkId: link.id },
                ({ description }) => {
                  setGrantLabel(description);
                }
              );

              if (res) {
                setGrantLabel(res.statusDescription);
              }
            }}
          >
            Grant
          </Button>
        </Tooltip>
      </GridItem>
    </>
  );
};
