import { EditIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  useBreakpointValue,
  Grid,
  GridItem,
  Flex,
  IconButton,
  Divider,
  chakra,
  Text,
  Image,
} from "@chakra-ui/react";
import { User } from "../../types/user";

export const MemberRow: React.FC<{ user: User }> = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mobileGrid = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Grid
        templateColumns={mobileGrid ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr 1fr"}
        padding="1rem"
      >
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
          <Flex alignItems="center" width="100%" justifyContent="space-between">
            <Text>100</Text>
            <IconButton
              color="white"
              aria-label="edit points"
              icon={<EditIcon />}
              onClick={onOpen}
            />
          </Flex>
          {/* <EditPoints isOpen={isOpen} onClose={onClose} userId={user.id} /> */}
        </GridItem>
      </Grid>
      <Divider color="secondary" />
    </>
  );
};
