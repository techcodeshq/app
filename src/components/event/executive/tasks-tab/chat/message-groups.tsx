import {
  Avatar,
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { MarkdownPreview } from "@components/shared/markdown";
import moment from "moment";
import { MutableRefObject, useState } from "react";
import { Return } from ".";
import { ContextMenu } from "./context-menu";

export const MessageGroups: React.FC<{
  data: Return[];
  messageBox: MutableRefObject<HTMLDivElement>;
  lastMessage: (node: any) => void;
}> = ({ data, messageBox, lastMessage }) => {
  const contextControls = useDisclosure();
  const [position, setPosition] = useState([0, 0]);
  const [deleteParams, setDeleteParams] = useState(null);

  return (
    <>
      {data && (
        <Flex flexDir="column" ref={messageBox}>
          {data
            .slice()
            .reverse()
            .map((result, dataIndex) =>
              result.groups.map((group, groupIndex) => (
                <Flex mt="1rem" w="100%">
                  <Avatar src={group.user.image} w="2.5rem" h="2.5rem" />
                  <Stack spacing="0" ml="0.5rem">
                    <HStack>
                      <Text fontWeight="600" fontSize="1.1rem">
                        {group.user.name}
                      </Text>
                      <Text
                        fontWeight="300"
                        color="gray.500"
                        fontSize="0.8rem"
                        whiteSpace="pre-line"
                      >
                        {moment(group.createdAt).calendar()}
                      </Text>
                    </HStack>
                    <Flex flexDir="column">
                      {group.messages
                        .slice()
                        .reverse()
                        .map((message, messageIndex) => (
                          <Box
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setPosition([e.clientX, e.clientY]);
                              setDeleteParams({
                                id: message.id,
                                page: message.page,
                              });
                              contextControls.onOpen();
                            }}
                            ref={
                              dataIndex === data.length - 1 &&
                              groupIndex === result.groups.length - 1 &&
                              messageIndex === group.messages.length - 1
                                ? lastMessage
                                : null
                            }
                          >
                            <MarkdownPreview content={message.content} />
                          </Box>
                        ))}
                    </Flex>
                  </Stack>
                </Flex>
              )),
            )}
        </Flex>
      )}
      <Box position="absolute" left={position[0]} top={position[1]}>
        <ContextMenu control={contextControls} params={deleteParams} />
      </Box>
    </>
  );
};
