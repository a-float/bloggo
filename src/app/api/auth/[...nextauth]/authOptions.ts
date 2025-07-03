import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { Prisma, User } from "@prisma/client";
import { getUserDTO, UserDTO } from "@/data/user-dto.ts";

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ user, token }) {
      if (user) {
        token.user = getUserDTO(user as User);
      }
      return token;
    },
    session({ session, token, user }) {
      console.log("in session", { session, token, user });
      return {
        ...session,
        user: (token?.user ?? null) as UserDTO | null,
      };
    },
    // async signIn({ user, account }) {
    //   if (account?.provider === "google") {
    //     if (!user.email) return false;
    //     const existingUser = await prisma.user.findUnique({
    //       where: { email: user.email },
    //     });

    //     if (!existingUser) {
    //       console.log("Creating account for OAuth user");
    //       await prisma.user.create({
    //         data: {
    //           name: user.name || user.email,
    //           email: user.email,
    //           image: user.image,
    //         },
    //       });
    //     }
    //   }

    //   return true;
    // },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
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
          if (!user || !user.password) return null;
          const isValidPassword = await compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) return null;
          return getUserDTO(user);
        } catch (error) {
          if (error instanceof Prisma.PrismaClientInitializationError) {
            throw new Error("Database connection error");
          }
          return null;
        }
      },
    }),
  ],
} as const satisfies NextAuthOptions;
