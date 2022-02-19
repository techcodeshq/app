import { Divider, Flex, Heading, Stack } from "@chakra-ui/react";

export const TabHeading: React.FC<{ heading: string }> = ({
  heading,
  children,
}) => {
  return (
    <Stack spacing="0.8rem">
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Heading fontWeight="medium" fontSize="1.85rem">
          {heading}
        </Heading>
        {children}
      </Flex>
      <Divider />
    </Stack>
  );
};
