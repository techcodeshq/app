import { Avatar, Td, Tr, useBreakpointValue } from "@chakra-ui/react";
import { ContextItem, ContextMenu } from "@components/context-menu";
import { DeleteItem } from "@components/delete-item";
import { EventLinkRedeem } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { BsTrash } from "react-icons/bs";

type Item = EventLinkRedeem & {
  member: {
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
    id: string;
  };
};

export const LinkRedeemRow: React.FC<{ item: Item }> = ({ item }) => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const router = useRouter();

  return (
    <React.Fragment key={item.member.user.id}>
      <Tr
        onClick={() => router.push(`/user/${item.member.user.id}`)}
        onAuxClick={(e) => {
          if (e.button === 1) {
            window.open(`/user/${item.member.user.id}`, "_blank");
          }
        }}
        _hover={{ cursor: "pointer" }}
      >
        {!isMobile && (
          <Td>
            <Avatar
              alt={`${item.member.user.name}-avatar`}
              src={item.member.user.image}
            />
          </Td>
        )}
        <Td>{item.member.user.name}</Td>
        <Td>{item.statusDescription}</Td>
        <Td>{new Date(item.createdAt).toLocaleString()}</Td>
        <Td isNumeric>
          <ContextMenu>
            <DeleteItem
              url={`/links/redeem/${item.eventLinkId}/${item.member.id}`}
              refetchUrl={`/links/redeemed/${item.eventLinkId}`}
              itemName={item.member.user.name}
              warningText="Are you sure you would like to undo the redeem for this user? This should not be done if the redeem was successful!"
            >
              {(onOpen) => (
                <ContextItem
                  onClick={() => onOpen()}
                  text="Delete"
                  Icon={BsTrash}
                />
              )}
            </DeleteItem>
          </ContextMenu>
        </Td>
      </Tr>
    </React.Fragment>
  );
};
