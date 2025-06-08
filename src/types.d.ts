import { type Prisma } from "@prisma/client";

type BlogWithCoverImage = Prisma.BlogGetPayload<{
  include: { coverImage: true };
}>;

type TagWithCount = {
  tag: string;
  count: number;
};

// declare module "next-auth" {
//   interface User extends DefaultUser {
//     id: number;
//   }

//   interface Session extends DefaultSession {
//     user: DefaultSession["user"] & { id: number };
//   }
// }
