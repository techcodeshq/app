import {
  Box,
  Menu,
  MenuList,
  useColorModeValue,
  UseDisclosureReturn,
} from "@chakra-ui/react";

export const RightClickMenu: React.FC<{
  control: UseDisclosureReturn;
  position: number[];
}> = ({ control, position, children: niñxs }) => {
  const { isOpen, onClose } = control;
  const bgColor = useColorModeValue("bg.200", "bg.700");

  return (
    <Box position="absolute" left={position[0]} top={position[1]}>
      <Menu isOpen={isOpen} onClose={onClose}>
        <MenuList shadow="md" bgColor={bgColor}>
          {niñxs}
        </MenuList>
      </Menu>
    </Box>
  );
};
