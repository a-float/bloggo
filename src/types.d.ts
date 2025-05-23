import { type Prisma } from "@prisma/client";

type BlogWithCoverImage = Prisma.BlogGetPayload<{
  include: { coverImage: true };
}>;

declare module "next-auth" {
  interface User extends DefaultUser {
    id: number;
  }
}
