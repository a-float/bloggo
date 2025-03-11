import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const blogData: Prisma.BlogCreateInput[] = [
  {
    title: "A Day In Venice",
    content: "It was very nice <3",
  },
  {
    title: "A Walk In The Park",
    content: "Very cold brr",
  },
];

export async function main() {
  for (const data of blogData) {
    await prisma.blog.create({ data });
  }
}

main();
