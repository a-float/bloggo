import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { Prisma } from "@prisma/client";
import { getUserDTO, UserDTO } from "@/data/user-dto.ts";

const adapter = PrismaAdapter(prisma);

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ user, token }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: (token?.user ?? null) as UserDTO | null,
      };
    },
  },
  adapter,
  events: {
    linkAccount: async ({ user, profile }) => {
      if ("emailVerified" in profile) {
        await adapter.updateUser?.({
          id: user.id,
          emailVerified: profile.emailVerified ? new Date() : null,
        });
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        emailVerified: profile.email_verified,
      }),
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.AUTH_RESEND_KEY,
        },
      },
      from: process.env.EMAIL_FROM,
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
