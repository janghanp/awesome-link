import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "../../../lib/prisma";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@test.com" },
        name: { label: "Name", type: "text", placeholder: "James" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials.name) {
          //sign up
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          //The given email is already in use.
          if (user) {
            //send a specific error to the client so that an error message can be shown on the client
            //callbackurl to either /login or /signin
            return null;
          }

          const hashedPasswrod = await bcrypt.hash(credentials.password, 12);

          const newUser = await prisma.user.create({
            data: {
              name: credentials.name,
              email: credentials.email,
              password: hashedPasswrod,
            },
          });

          return newUser;
        } else {
          //sign in
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          const match = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (user && match) {
            return user;
          } else {
            //implment situations that No user found or password dosen't match
            return null;
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      //Add any aditional data to the session when loging in is successful.
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
