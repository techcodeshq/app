import { Text, Stack, Box, Center } from "@chakra-ui/react";

export const EventCard: React.FC<{ bgColor?: string }> = ({ bgColor }) => {
  return (
    <Stack
      bgColor={bgColor || "bg.700"}
      minW="20rem"
      p="1rem 1.5rem"
      borderRadius="0.5rem"
      spacing="1rem"
      transition="transform 0.2s ease-in"
      _hover={{
        cursor: "pointer",
        shadow: "lg",
        transform: "scale(1.02)",
      }}
    >
      <Box>
        <Text>Stuy Pea Jam</Text>
        <Text opacity="50%">Let's make games while eating peanuts?</Text>
      </Box>
      <Box
        bgColor={
          bgColor ? `bg.${parseInt(bgColor.split(".")[1]) - 100}` : "bg.600"
        }
        w="8rem"
        p="0.8rem"
      >
        <Center>
          <Text>4PM - 6PM</Text>
        </Center>
      </Box>
    </Stack>
  );
};
