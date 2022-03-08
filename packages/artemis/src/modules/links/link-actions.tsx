import { Td, Tr } from "@chakra-ui/react";
import { actionBasedValue } from "src/util/actionBasedValue";
import { LinkApplyInstructions } from "@prisma/client";
import React from "react";

export const LinkActions: React.FC<{
  metadata: LinkApplyInstructions;
}> = ({ metadata: md }) => {
  return (
    <Tr key={md.key}>
      <Td color={actionBasedValue(md.action, ["green.300", "red.400", null])}>
        {md.key}
      </Td>
      <Td color={actionBasedValue(md.action, ["green.300", "red.400", null])}>
        {actionBasedValue(md.action, ["+", "-", "="])}
        {md.value}
      </Td>
    </Tr>
  );
};
