import {
  Flex,
  Menu,
  MenuItem,
  MenuList,
  useColorModeValue,
  UseDisclosureReturn,
  Text,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MouseEvent, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { DeleteItem } from "./delete-item";

export const ContextItem: React.FC<{
  text: string;
  onClick: (event?: MouseEvent) => Promise<void> | void;
  Icon?: IconType;
}> = ({ text, Icon, onClick }) => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => setPageLoading(false), []);

  if (pageLoading) return null;

  if (isMobile && !pageLoading) {
    return (
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p="0.5rem 0"
        _hover={{ cursor: "pointer" }}
        onClick={async (event) => {
          setLoading(true);
          await onClick(event);
          setLoading(false);
        }}
      >
        <Text>{text}</Text>
        {Icon && <Icon />}
        {loading && <Spinner size="sm" />}
      </Flex>
    );
  } else if (!pageLoading) {
    return (
      <MenuItem
        icon={Icon ? <Icon /> : null}
        onClick={async (event) => {
          setLoading(true);
          await onClick(event);
          setLoading(false);
        }}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{text}</Text>
          {loading && <Spinner size="sm" />}
        </Flex>
      </MenuItem>
    );
  }
};
