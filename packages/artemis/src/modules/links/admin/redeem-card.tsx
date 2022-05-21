import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Avatar, Flex, HStack, Stack, Text, Tooltip } from "@chakra-ui/react";
import { DeleteItem } from "@components/delete-item";
import { ContextItem, ContextMenu } from "@components/context-menu";
import { EventLinkRedeemStatus } from "@prisma/client";
import moment from "moment";
import { useRouter } from "next/router";
import { BsTrash } from "react-icons/bs";
import { Response } from "./link-data";

export const LinkRedeemCard: React.FC<{ redeem: Response }> = ({
  redeem: item,
}) => {
  const { user, ...redeem } = item;
  const router = useRouter();

  return (
    <Flex
      p="1.5rem"
      bgColor="bg.700"
      borderRadius="0.4rem"
      alignItems="center"
      justifyContent="space-between"
      key={redeem.userId}
      _hover={{ cursor: "pointer" }}
      onClick={() => router.push(`/user/${user.id}`)}
    >
      <Flex gap="1rem" alignItems="center">
        <Avatar src={user.image} size="md" />
        <Stack spacing={0}>
          <Text fontWeight="regular">{user.name}</Text>
          <Text opacity="50%">
            Redeemed On:{" "}
            {moment(redeem.createdAt).isSame(moment(), "day")
              ? new Date(redeem.createdAt).toLocaleTimeString()
              : new Date(redeem.createdAt).toLocaleDateString()}
          </Text>
        </Stack>
      </Flex>
      <HStack>
        <Tooltip label={redeem.statusDescription}>
          {redeem.status === EventLinkRedeemStatus.SUCCESS ? (
            <CheckIcon color="green.300" />
          ) : (
            <CloseIcon color="red.300" />
          )}
        </Tooltip>
        <ContextMenu>
          <DeleteItem
            url={`/links/redeem/${item.eventLinkId}/${user.id}`}
            refetchUrl={`/links/redeemed/${item.eventLinkId}`}
            itemName={user.name}
            warningText="Are you sure you would like to undo the redeem for this user? This should not be done if the redeem was successful!"
          >
            {(onOpen) => (
              <ContextItem
                color="red.300"
                onClick={() => onOpen()}
                text="Delete"
                Icon={BsTrash}
              />
            )}
          </DeleteItem>
        </ContextMenu>
      </HStack>
    </Flex>
  );
};
