import "server-only";
import getUser from "@/lib/getUser";
import { User } from "@prisma/client";

export function getUserDTO(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export type UserDTO = Awaited<ReturnType<typeof getUser>>;
