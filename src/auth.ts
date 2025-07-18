import prisma from "@/lib/prisma";
import NextAuth, { AuthError, type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { Prisma, VerificationTokenType, type User } from "@prisma/client";
import { getUserDTO, UserDTO } from "@/data/user-dto.ts";
import { createEmailChannel } from "@/lib/email/email.channel.factory";
import { Adapter } from "next-auth/adapters";
import dayjs from "dayjs";
import { createVerificationEmailMessage } from "@/lib/email/email.message.factory";
import { emailTypeMapper } from "@/lib/email/email-type-mapper";
import * as yup from "yup";

function setQueryParam(
  urlString: string,
  param: string,
  value: string
): string {
  const url = new URL(urlString);
  url.searchParams.set(param, value);
  return url.toString();
}

// TODO move to a schemas/validation file?
const signInSchema = yup.object({
  email: yup.string().min(1).required(),
  password: yup.string().min(1).required(),
});

const customAdapter: Adapter = {
  ...PrismaAdapter(prisma),
  async createVerificationToken(data) {
    const { type, email } = emailTypeMapper.decode(data.identifier);
    const maxTokenAge = createVerificationEmailMessage(type, {
      url: "",
    }).getMaxAge();
    return await prisma.verificationToken.create({
      data: {
        identifier: email,
        type,
        token: data.token,
        expires: dayjs().add(maxTokenAge, "s").toDate(),
      },
    });
  },
};

const authOptions = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ user, token, trigger, session }) {
      if (trigger === "update" && session.name) {
        // TODO fix any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (token.user as any).name = session.name;
      }
      if (user) {
        // TODO figure out when the full user comes in. on first login?
        if ("password" in user) {
          token.user = getUserDTO(user as User);
        } else {
          token.user = user;
        }
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
  adapter: customAdapter,
  events: {
    linkAccount: async ({ user, profile }) => {
      if ("emailVerified" in profile) {
        if (!user.id) {
          console.warn("linkAccount failed: user has not id", user);
          return;
        }
        await customAdapter.updateUser?.({
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
        port: parseInt(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.AUTH_RESEND_KEY,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest(params) {
        const { type, email } = emailTypeMapper.decode(params.identifier);
        if (
          type === VerificationTokenType.RESET_PASSWORD &&
          !(await customAdapter.getUserByEmail?.(email))
        ) {
          throw new AuthError("New user can't request password reset");
        }
        const url = setQueryParam(params.url, "email", email);
        const message = createVerificationEmailMessage(type, { url });
        await createEmailChannel().send(email, message);
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = await signInSchema.cast(credentials);
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;

          const isValidPassword = await compare(password, user.password);
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
} as const satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
