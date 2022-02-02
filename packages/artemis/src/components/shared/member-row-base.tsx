import { Avatar, Td, Text, Tr, useBreakpointValue } from "@chakra-ui/react";
import { User } from "@prisma/client";

export const BaseMemberRow: React.FC<{ user: User; showOsis?: boolean }> = ({
  user,
  showOsis,
}) => {
  const mobileGrid = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {!mobileGrid && (
        <Td>
          <Avatar src={user.image} />
        </Td>
      )}
      {showOsis && <Td isTruncated>{user.osis}</Td>}
      <Td isTruncated>{user.name}</Td>
      {!mobileGrid && <Td>{user.email}</Td>}
    </>
  );
};
