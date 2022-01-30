import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import { MutableRefObject } from "react";

export const ScrollWarnings: React.FC<{
  visible: boolean;
  updateQueued: boolean;
  messageBox: MutableRefObject<HTMLDivElement>;
}> = ({ visible, updateQueued, messageBox }) => {
  return (
    <>
      {!visible && updateQueued && (
        <Flex
          bgColor="red.400"
          p="0.5rem"
          color="text.900"
          fontWeight="500"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="0.5rem"
          borderBottomRadius={0}
          _hover={{ cursor: "pointer" }}
          onClick={() =>
            messageBox.current?.lastElementChild?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <Text>You have unread messages!</Text>
          <Flex alignItems="center">
            <Text mr="0.5rem">View</Text>
            <ChevronDownIcon />
          </Flex>
        </Flex>
      )}
      {!visible && !updateQueued && (
        <Flex
          bgColor="gray.800"
          p="0.5rem"
          fontWeight="500"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="0.5rem"
          borderBottomRadius={0}
          _hover={{ cursor: "pointer" }}
          onClick={() =>
            messageBox.current?.lastElementChild?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <Text>Viewing old messages</Text>
          <Flex alignItems="center">
            <Text mr="0.5rem">Jump to present</Text>
            <ChevronDownIcon />
          </Flex>
        </Flex>
      )}
    </>
  );
};
