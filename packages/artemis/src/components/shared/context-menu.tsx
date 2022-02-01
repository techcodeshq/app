import {
  Box,
  Menu,
  MenuList,
  useColorModeValue,
  UseDisclosureReturn,
} from "@chakra-ui/react";

export const ContextMenu: React.FC<{
  control: UseDisclosureReturn;
  position: number[];
}> = ({ control, position, children }) => {
  const { isOpen, onClose } = control;
  const bgColor = useColorModeValue("bg.200", "bg.700");

  return (
    <Box position="absolute" left={position[0]} top={position[1]}>
      <Menu isOpen={isOpen} onClose={onClose}>
        <MenuList shadow="md" bgColor={bgColor}>
          {children}
        </MenuList>
      </Menu>
    </Box>
  );
};
