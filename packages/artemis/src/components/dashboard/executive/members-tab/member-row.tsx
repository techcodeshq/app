import { ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  GridItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ContextItem } from "@components/shared/context-item";
import { ContextMenu } from "@components/shared/context-menu";
import { DeleteItem } from "@components/shared/delete-item";
import { BaseMemberRow } from "@components/shared/member-row-base";
import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { BsTrash } from "react-icons/bs";

export const MemberRow: React.FC<{ user: User }> = ({ user }) => {
  const color = useColorModeValue("bg.100", "bg.800");
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <React.Fragment key={user.id}>
      <Tr
        onClick={() => {
          router.push(`/user/${user.id}`);
        }}
        onAuxClick={(e) => {
          if (e.button === 1) {
            window.open(`/user/${user.id}`, "_blank");
          }
        }}
        _hover={{ cursor: "pointer" }}
      >
        <BaseMemberRow user={user} showOsis={!isMobile} />
        <Td isNumeric>
          <ContextMenu>
            <DeleteItem
              url={`/users/${user.id}`}
              refetchUrl="/users"
              itemName={user.name}
              warningText={
                "Are you absolutely sure you want to delete this user? This should probably only be done when trying to fix points for a user that has used multiple accounts."
              }
              iconColor={color}
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
