import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/util/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import crypto from "crypto";

interface UserSession {
  id?: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
}
   
export const authOptions: NextAuthOptions = {
  pages: {},
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "xyz@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
          select: {
            id: true,
            email: true,
            pwd: true,
            name: true,
          },
        });

        if (user) {
          const hexPass = crypto
            .createHash("md5")
            .update(credentials?.password as string)
            .digest("hex");
          const pwdCheck = user.pwd === hexPass;
          if (!pwdCheck) return null;
          return {
            ...user,
            pwd: undefined,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        const userSession: UserSession = {
          id: token.id as string,
          name: token.name,
        //   can add more fields 
        };
        session.user = userSession;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
