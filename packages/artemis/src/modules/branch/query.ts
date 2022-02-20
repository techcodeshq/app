import { Branch, BranchMember, Event } from "@prisma/client";

export type QueryBranch = Branch & {
  members: BranchMember[];
  events: Event[];
};
