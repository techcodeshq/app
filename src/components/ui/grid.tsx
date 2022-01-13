import { Grid as ChakraGrid, GridProps } from "@chakra-ui/react";

export const Grid: React.FC<GridProps> = ({ children, ...props }) => {
  return (
    <ChakraGrid {...props} gap="2rem" padding="1.5rem" fontWeight="500">
      {children}
    </ChakraGrid>
  );
};
