import "server-only";
import { getUserDTO } from "@/data/user-dto.ts";
import prisma from "../prisma";

export async function findUsersByString(query: string) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
  });

  return users.map((user) => getUserDTO(user));
}
