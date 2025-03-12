import { PrismaClient, Prisma } from "@prisma/client";
import fs from "node:fs";

const prisma = new PrismaClient();

const blogData: Prisma.BlogCreateInput[] = [
  {
    title: "Trip to Venice",
    slug: "trip-to-venice",
    summary:
      "Explore Venice’s canals, visit St. Mark’s Basilica, take a gondola ride, discover Murano and Burano, and enjoy Venetian cuisine.",
    content: fs.readFileSync("./prisma/venice.mdx").toString(),
  },
  {
    title: "Trip to Prague",
    slug: "trip-to-prague",
    summary:
      "Wander through Prague’s Old Town, cross Charles Bridge, explore Prague Castle, visit the Jewish Quarter, and enjoy Czech food and beer.",
    content: fs.readFileSync("./prisma/prague.mdx").toString(),
  },
];

export async function main() {
  for (const data of blogData) {
    await prisma.blog.create({ data });
  }
}

main();
