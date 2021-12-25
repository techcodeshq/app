import { Session as NextSession } from "next-auth";

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
    osis?: string;
    role: string;
  }
}
