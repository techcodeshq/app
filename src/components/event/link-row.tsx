import {
  GridItem,
  chakra,
  Text,
  useBreakpointValue,
  Box,
  Button,
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAxios } from "@lib/axios";
import { EventLink, LinkApplyInstructions, User } from "@typings";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useEvent } from "./context";

export const LinksRow: React.FC<{
  link: EventLink & { metadata: LinkApplyInstructions[] };
}> = ({ link }) => {
  //   const mobileGrid = useBreakpointValue({ base: true, md: false });
  const { event } = useEvent();
  const bgColor = useColorModeValue("bg.100", "bg.800");
  const [linkIndex, setLinkIndex] = useState(0);
  const { axios } = useAxios();
  const { mutate } = useSWRConfig();

  return (
    <>
      <GridItem>
        <Text width="80%" isTruncated>
          {link.name}
        </Text>
      </GridItem>
      <GridItem alignSelf="center">
        <Text width="10vmax" textAlign="left" isTruncated>
          {link.uses === null ? "Unlimited" : link.uses}
        </Text>
      </GridItem>
      <GridItem alignSelf="center">
        <chakra.span
          bgColor={link.enabled ? "green.300" : "red.300"}
          p="0.5rem"
          color="bg.800"
          fontWeight="500"
          borderRadius="20px"
          onClick={async () => {
            await axios.patch("/links", {
              id: link.id,
              value: !link.enabled,
            });

            mutate(`/links/${event.id}`);
          }}
          cursor="pointer"
          _hover={{
            bgColor: link.enabled ? "green.400" : "red.500",
            transition: "background-color ease-in 200ms",
          }}
        >
          {link.enabled ? "Active" : "Inactive"}
        </chakra.span>
      </GridItem>
      <GridItem alignSelf="center">
        <Popover placement="bottom" closeOnBlur={true}>
          <PopoverTrigger>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent bg={bgColor}>
            <PopoverHeader pt={4} fontWeight="bold" border="0">
              {link.metadata[linkIndex]?.key.substring(0, 1).toUpperCase() +
                link.metadata[linkIndex]?.key
                  .toLowerCase()
                  .substring(
                    1,
                    link.metadata[linkIndex]?.key.toLowerCase().length
                  )}
            </PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              {link.metadata[linkIndex]?.action.substring(0, 1) +
                link.metadata[linkIndex]?.action
                  .toLowerCase()
                  .substring(
                    1,
                    link.metadata[linkIndex]?.action.toLowerCase().length
                  )}{" "}
              by {link.metadata[linkIndex]?.value}
            </PopoverBody>
            <PopoverFooter
              border="0"
              d="flex"
              alignItems="center"
              justifyContent="space-between"
              pb={4}
            >
              <Box fontSize="sm">
                Action {linkIndex + 1} of {link.metadata.length}
              </Box>
              <ButtonGroup size="sm">
                {linkIndex > 0 && (
                  <Button
                    colorScheme="green"
                    onClick={() => setLinkIndex((cur) => cur - 1)}
                  >
                    Back
                  </Button>
                )}
                {linkIndex < link.metadata.length - 1 && (
                  <Button
                    colorScheme="blue"
                    onClick={() => setLinkIndex((cur) => cur + 1)}
                  >
                    Next
                  </Button>
                )}
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </GridItem>
    </>
  );
};
