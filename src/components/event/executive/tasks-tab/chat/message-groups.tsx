import {
  Avatar,
  Box,
  chakra,
  Flex,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import { MutableRefObject } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Return } from ".";

const StylableMarkdown = chakra(ReactMarkdown);

export const MessageGroups: React.FC<{
  data: Return[];
  messageBox: MutableRefObject<HTMLDivElement>;
  lastMessage: (node: any) => void;
}> = ({ data, messageBox, lastMessage }) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");

  return (
    <>
      {data && (
        <Flex flexDir="column" ref={messageBox}>
          {data
            .slice()
            .reverse()
            .map((result, dataIndex) =>
              result.groups.map((group, groupIndex) => (
                <Flex mt="1rem">
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
                            ref={
                              dataIndex === data.length - 1 &&
                              groupIndex === result.groups.length - 1 &&
                              messageIndex === group.messages.length - 1
                                ? lastMessage
                                : null
                            }
                          >
                            <StylableMarkdown
                              className="markdown-body"
                              remarkPlugins={[remarkGfm]}
                              bgColor={bgColor}
                            >
                              {message.content}
                            </StylableMarkdown>
                          </Box>
                        ))}
                    </Flex>
                  </Stack>
                </Flex>
              )),
            )}
        </Flex>
      )}
    </>
  );
};
