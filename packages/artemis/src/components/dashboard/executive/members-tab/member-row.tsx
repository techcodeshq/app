import { Button, GridItem, useColorModeValue } from "@chakra-ui/react";
import { DeleteItem } from "@components/shared/delete-item";
import { BaseMemberRow } from "@components/shared/member-row-base";
import { User } from "@typings";
import Link from "next/link";

export const MemberRow: React.FC<{ user: User }> = ({ user }) => {
  const color = useColorModeValue("bg.100", "bg.800");

  return (
    <>
      <BaseMemberRow user={user} />
      <GridItem alignSelf="center">
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
      </GridItem>
    </>
  );
};
