import { PrismaClient, Prisma, Role, BlogVisibility } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const blogData: Prisma.BlogCreateInput[] = [
  {
    title: "Trip to Venice",
    date: new Date("2024-10-01"),
    visibility: BlogVisibility.PUBLIC,
    content:
      "Explore Venice’s canals, visit St. Mark’s Basilica, take a gondola ride, discover Murano and Burano, and enjoy Venetian cuisine.",
  },
  {
    title: "Trip to Prague",
    visibility: BlogVisibility.PUBLIC,
    date: new Date("2023-03-21"),
    content:
      "Wander through Prague’s Old Town, cross Charles Bridge, explore Prague Castle, visit the Jewish Quarter, and enjoy Czech food and beer.",
  },
];

async function getUsers() {
  const password = await hash("pass", 10);
  const users: Prisma.UserCreateInput[] = [...new Array(10)].map((_, i) => ({
    email: `user${i + 1}`,
    name: `User ${i + 1}`,
    password,
    role: Role.USER,
  }));

  users.push({
    email: "matt",
    name: "matt",
    password: await hash("mati123", 10),
    role: Role.ADMIN,
  });

  return users;
}

export async function main() {
  for (const data of blogData) {
    await prisma.blog.create({ data });
  }

  for (const data of await getUsers()) {
    await prisma.user.create({ data });
  }
}

main();
