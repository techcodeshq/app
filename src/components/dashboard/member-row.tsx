import { GridItem, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { User } from "../../types/user";

export const MemberRow: React.FC<{ user: User }> = ({ user }) => {
  const mobileGrid = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {!mobileGrid && (
        <GridItem>
          <Image
            alignSelf="center"
            src={user.image}
            height="3rem"
            width="3rem"
            borderRadius="50%"
          />
        </GridItem>
      )}
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
      {!mobileGrid && (
        <GridItem alignSelf="center">
          <Text width="18vmax" textAlign="left" isTruncated>
            {user.email}
          </Text>
        </GridItem>
      )}
      <GridItem alignSelf="center">
        <Text>100</Text>
      </GridItem>
    </>
  );
};
