import { Divider, GridItem } from "@chakra-ui/react";
import { actionBasedValue } from "@lib/util/actionBasedValue";
import { LinkApplyInstructions } from "@prisma/client";
import React from "react";

export const LinkActions: React.FC<{
  metadata: LinkApplyInstructions;
}> = ({ metadata: md }) => {
  return (
    <React.Fragment key={md.key}>
      <GridItem
        color={actionBasedValue(md.action, ["green.300", "red.400", null])}
      >
        {md.key}
      </GridItem>
      <GridItem
        color={actionBasedValue(md.action, ["green.300", "red.400", null])}
      >
        {actionBasedValue(md.action, ["+", "-", "="])}
        {md.value}
      </GridItem>
      <GridItem colSpan={2}>
        <Divider />
      </GridItem>
    </React.Fragment>
  );
};
