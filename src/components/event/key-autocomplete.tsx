import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@hooks/useQuery";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import tabs from "./tabs";

interface CreateEventProps {
  name: string;
  setValue: (field: string, value: string, shouldValidate: boolean) => void;
}

export const KeyInput: React.FC<CreateEventProps> = ({
  children,
  setValue,
  name,
}) => {
  const [displayInput, setDisplayInput] = useState(false);
  const { isOpen, onOpen: menuOpen } = useDisclosure();
  const menuColor = useColorModeValue("bg.100", "bg.800");
  const { data } = useQuery<string[]>("/links/actions");

  return (
    <>
      {!displayInput && (
        <Menu autoSelect={false} isOpen={isOpen}>
          <Button onClick={menuOpen}>View Keys</Button>
          <MenuList bgColor={menuColor}>
            {data &&
              data.map((value, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    setValue(name, value, true);
                    setDisplayInput(true);
                  }}
                >
                  {value}
                </MenuItem>
              ))}
            <MenuDivider />
            <MenuItem
              onClick={() => {
                setValue(name, "", true);
                setDisplayInput(true);
              }}
            >
              Add New
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      {displayInput && (
        <InputGroup>
          {children}
          <InputRightElement>
            <ChevronDownIcon
              onClick={() => {
                setDisplayInput(false);
                menuOpen();
              }}
            />
          </InputRightElement>
        </InputGroup>
      )}
    </>
  );
};
