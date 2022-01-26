import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";

export const TaskSection: React.FC<{ heading: string }> = ({
  heading,
  children,
}) => {
  const bgColor = useColorModeValue("bg.100", "bg.800");

  return (
    <AccordionItem border="none" mb="0.5rem">
      <AccordionButton bgColor={bgColor} shadow="sm" _hover={{}} p="1rem">
        <Flex alignItems="center" justifyContent="space-between" w="100%">
          <Heading fontWeight="500" fontSize="1.2rem">
            {heading}
          </Heading>
          <AccordionIcon />
        </Flex>
      </AccordionButton>
      <AccordionPanel p={0} mt="0.5rem">
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
};
