import { PrismaClient, Prisma } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const blogData: Prisma.BlogCreateInput[] = [
  {
    title: "Trip to Venice",
    date: new Date("2024-10-01"),
    isPublic: true,
    content:
      "Explore Venice’s canals, visit St. Mark’s Basilica, take a gondola ride, discover Murano and Burano, and enjoy Venetian cuisine.",
  },
  {
    title: "Trip to Prague",
    isPublic: true,
    date: new Date("2023-03-21"),
    content:
      "Wander through Prague’s Old Town, cross Charles Bridge, explore Prague Castle, visit the Jewish Quarter, and enjoy Czech food and beer.",
  },
];

export async function main() {
  for (const data of blogData) {
    await prisma.blog.create({ data });
  }
  await prisma.user.create({
    data: {
      email: "matt",
      name: "matt",
      password: await hash("mati123", 10),
      isAdmin: true,
    },
  });
}

main();
