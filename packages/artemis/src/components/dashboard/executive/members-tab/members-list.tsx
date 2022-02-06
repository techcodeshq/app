import {
  Avatar,
  Flex,
  Stack,
  Text,
  Link,
  useColorModeValue,
  color,
} from "@chakra-ui/react";
import { ContextItem } from "@components/shared/context-item";
import { ContextMenu } from "@components/shared/context-menu";
import { DeleteItem } from "@components/shared/delete-item";
import { useQuery } from "@hooks/useQuery";
import { User } from "next-auth";
import { useRouter } from "next/router";
import { BsTrash } from "react-icons/bs";

export const MembersList = () => {
  const { data } = useQuery<User[]>("/users");
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const router = useRouter();

  return (
    <Flex flexDir="column" gap="1rem">
      {data &&
        data.map((user) => (
          <Flex
            p="1rem"
            bgColor={bgColor}
            borderRadius="0.4rem"
            alignItems="center"
            justifyContent="space-between"
            shadow="md"
            _hover={{ cursor: "pointer" }}
            onClick={(e) => {
              router.push(`/user/${user.id}`);
            }}
            onAuxClick={(e) => {
              if (e.button === 1) {
                window.open(`/user/${user.id}`, "_blank");
              }
            }}
            key={user.id}
          >
            <Flex gap="1rem" alignItems="center">
              <Avatar src={user.image} size="md" />
              <Stack spacing={2}>
                <Text fontWeight="600">{user.name}</Text>
                <Text>{user.email}</Text>
              </Stack>
            </Flex>
            <ContextMenu>
              <DeleteItem
                url={`/users/${user.id}`}
                refetchUrl="/users"
                itemName={user.name}
                warningText={
                  "Are you absolutely sure you want to delete this user? This should probably only be done when trying to fix points for a user that has used multiple accounts."
                }
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
          </Flex>
        ))}
    </Flex>
  );
};
