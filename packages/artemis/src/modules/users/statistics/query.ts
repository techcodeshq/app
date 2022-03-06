import {
  UserMetadata,
  Branch,
  EventLinkRedeem,
  EventLink,
  LinkApplyInstructions,
} from "@prisma/client";

export type Query = {
  metadata: UserMetadata[];
  branch: Branch;
  linkRedeem: (EventLinkRedeem & {
    eventLink: EventLink & {
      metadata: LinkApplyInstructions[];
    };
  })[];
};
