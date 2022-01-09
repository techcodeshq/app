import {
  Button,
  GridItem,
  Image,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
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
    </>
  );
};
