import { EventLink, LinkApplyInstructions } from "@prisma/client";

export type QueryLink = EventLink & {
  metadata: LinkApplyInstructions[];
  _count: {
    redeemedBy: number;
  };
};
