import { type Prisma } from "@prisma/client";

type BlogWithCoverImage = Prisma.BlogGetPayload<{
  include: { coverImage: true };
}>;
