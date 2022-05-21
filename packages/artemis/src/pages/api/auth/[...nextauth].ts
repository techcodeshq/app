import Adapter from "@modules/auth/next-auth/adapter";
import GoogleProvider from "@modules/auth/next-auth/provider";
import { NextApiHandler } from "next";
import NextAuth from "next-auth";

const handler: NextApiHandler = (req, res) => {
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

export default handler;
