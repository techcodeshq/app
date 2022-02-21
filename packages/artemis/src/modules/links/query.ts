import { EventLink } from "@prisma/client";

export type QueryLink = EventLink & {
  _count: {
    redeemedBy: number;
  };
};
