import { Session as NextSession } from "next-auth";
import { ClubMemberInfo } from "@prisma/client";

declare module "next-auth" {
  interface Session extends NextSession {
    user: User;
  }

  interface User {
    id: string;
    email: string;
    image: string;
    emailVerified?: Date;
    name: string;
    role: string;
    sessionToken?: string;
    clubMemberInfo?: ClubMemberInfo;
  }
}
