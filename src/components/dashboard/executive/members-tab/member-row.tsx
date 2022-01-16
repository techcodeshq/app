import { Button, GridItem } from "@chakra-ui/react";
import { DeleteItem } from "@components/shared/delete-item";
import { BaseMemberRow } from "@components/shared/member-row-base";
import { User } from "@typings";
import Link from "next/link";

export const MemberRow: React.FC<{ user: User }> = ({ user }) => {
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
          confirmKey={user.name}
        />
      </GridItem>
    </>
  );
};
