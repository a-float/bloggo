import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { Prisma } from "@prisma/client";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) return null;
          const isValidPassword = await compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) return null;
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          if (error instanceof Prisma.PrismaClientInitializationError) {
            throw new Error("Database connection error");
          }
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
