import {
  Box,
  Button,
  Flex,
  GridItem,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ContextMenu } from "@components/shared/context-menu";
import { DeleteItem } from "@components/shared/delete-item";
import { BaseMemberRow } from "@components/shared/member-row-base";
import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export const MemberRow: React.FC<{ user: User }> = ({ user }) => {
  const color = useColorModeValue("bg.100", "bg.800");
  const router = useRouter();
  const contextControl = useDisclosure();

  return (
    <>
      <Tr
        onClick={() => router.push(`/user/${user.id}`)}
        _hover={{ cursor: "pointer" }}
      >
        <BaseMemberRow user={user} />
        {/* <GridItem alignSelf="center">
        <Link href={`/user/${user.id}`}>
          <Button>View Details</Button>
        </Link>
      </GridItem>
      <GridItem alignSelf="center">
        <DeleteItem
          url={`/users/${user.id}`}
          refetchUrl="/users"
          itemName={user.name}
          warningText={
            "Are you absolutely sure you want to delete this user? This should probably only be done when trying to fix points for a user that has used multiple accounts."
          }
          iconColor={color}
        />
      </GridItem> */}
      </Tr>
    </>
  );
};
