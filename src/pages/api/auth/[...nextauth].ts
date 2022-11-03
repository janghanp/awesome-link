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
    //take about only signin
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@test.com" },
        name: { label: "Name", type: "text", placeholder: "James" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        //sign in
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          console.log("No user found");
          //No user found
          return null;
        }

        const match = await bcrypt.compare(credentials.password, user.password);

        if (match) {
          return user;
        } else {
          console.log("password dose not match");
          //Password dosen't match
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: "supersecret",
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
});
