import {
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
import { LinkApplyInstructions } from "@typings";
import { useState } from "react";
import { LinkWithMetadata } from "./links-grid";

export const LinkActionPopover: React.FC<{
  metadata: LinkApplyInstructions[];
}> = ({ metadata }) => {
  const [linkIndex, setLinkIndex] = useState(0);
  const bgColor = useColorModeValue("bg.100", "bg.800");

  return (
    <Popover placement="bottom" closeOnBlur={true}>
      <PopoverTrigger>
        <Button variant="filled" bgColor="accent.300">
          View
        </Button>
      </PopoverTrigger>
      <PopoverContent bg={bgColor}>
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          {metadata[linkIndex]?.key.substring(0, 1).toUpperCase() +
            metadata[linkIndex]?.key
              .toLowerCase()
              .substring(1, metadata[linkIndex]?.key.toLowerCase().length)}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          {metadata[linkIndex]?.action.substring(0, 1) +
            metadata[linkIndex]?.action
              .toLowerCase()
              .substring(
                1,
                metadata[linkIndex]?.action.toLowerCase().length
              )}{" "}
          {metadata[linkIndex]?.action === "SET" ? "to" : "by"}{" "}
          {metadata[linkIndex]?.value}
        </PopoverBody>
        <PopoverFooter
          border="0"
          d="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <Box fontSize="sm">
            Action {linkIndex + 1} of {metadata.length}
          </Box>
          <ButtonGroup size="sm">
            {linkIndex > 0 && (
              <Button onClick={() => setLinkIndex((cur) => cur - 1)}>
                Back
              </Button>
            )}
            {linkIndex < metadata.length - 1 && (
              <Button onClick={() => setLinkIndex((cur) => cur + 1)}>
                Next
              </Button>
            )}
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
