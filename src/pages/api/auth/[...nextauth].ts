import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getSession, signIn } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Adapter from "../../../lib/adapter";

export default NextAuth({
  adapter: Adapter(undefined),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // jwt: {
  //   secret: process.env.JWT_SECRET,
  // },
  // session: {
  //   strategy: "jwt",
  // },
  // events: {
  //   async signIn(message) {
  //     //   console.log(message);
  //   },
  // },
  pages: {
    newUser: "/auth/new-user",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
