import { Flex, Stat, StatLabel, StatNumber, StatArrow } from "@chakra-ui/react";
import { KeyValueAction, LinkApplyInstructions } from "@prisma/client";

export const LinkActionCard: React.FC<{ metadata: LinkApplyInstructions }> = ({
  metadata: md,
}) => {
  return (
    <Flex
      p="1.5rem"
      borderRadius="0.4rem"
      alignItems="center"
      justifyContent="space-between"
      bgColor="bg.700"
      key={md.key}
    >
      <Stat key={md.key}>
        <StatLabel>{md.key}</StatLabel>
        <Flex alignItems="center" gap="1rem">
          <StatNumber>{md.value}</StatNumber>
          <StatArrow
            type={
              md.action === KeyValueAction.INCREMENT ? "increase" : "decrease"
            }
          />
        </Flex>
      </Stat>
    </Flex>
  );
};
