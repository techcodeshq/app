import {
  Tr,
  Td,
  Avatar,
  useBreakpointValue,
  useDisclosure,
  color,
} from "@chakra-ui/react";
import { ContextItem } from "@components/shared/context-item";
import { ContextMenu } from "@components/shared/context-menu";
import { DeleteItem } from "@components/shared/delete-item";
import { EventLinkRedeem } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsTrash } from "react-icons/bs";

type Item = EventLinkRedeem & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export const LinkRedeemRow: React.FC<{ item: Item }> = ({ item }) => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const router = useRouter();
  const contextControl = useDisclosure();
  const [position, setPosition] = useState([0, 0]);

  return (
    <React.Fragment key={item.user.id}>
      <Tr
        onClick={() => router.push(`/user/${item.user.id}`)}
        onContextMenu={(e) => {
          e.preventDefault();
          setPosition([e.clientX, e.clientY]);
          contextControl.onOpen();
        }}
        _hover={{ cursor: "pointer" }}
      >
        {!isMobile && (
          <Td>
            <Avatar alt={`${item.user.name}-avatar`} src={item.user.image} />
          </Td>
        )}
        <Td>{item.user.name}</Td>
        <Td>{item.statusDescription}</Td>
        <Td>{new Date(item.createdAt).toLocaleString()}</Td>
      </Tr>
      <ContextMenu control={contextControl} position={position}>
        <DeleteItem
          url={`/links/redeem/${item.eventLinkId}/${item.user.id}`}
          refetchUrl={`/links/redeemed/${item.eventLinkId}`}
          itemName={item.user.name}
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
    </React.Fragment>
  );
};
