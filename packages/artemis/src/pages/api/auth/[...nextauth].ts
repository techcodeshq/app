import Adapter from "@lib/next-auth/adapter";
import GoogleProvider from "@lib/next-auth/provider";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";

export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, {
    adapter: Adapter(req),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        session.user = user;
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
};
