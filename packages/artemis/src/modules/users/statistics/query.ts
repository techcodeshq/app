import {
  UserMetadata,
  EventLinkRedeem,
  EventLink,
  LinkApplyInstructions,
} from "@prisma/client";

export type Query = {
  metadata: UserMetadata[];
  linkRedeem: (EventLinkRedeem & {
    eventLink: EventLink & {
      metadata: LinkApplyInstructions[];
    };
  })[];
};
