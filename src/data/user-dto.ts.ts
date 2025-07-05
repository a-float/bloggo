import "server-only";
import { User } from "@prisma/client";

export function getUserDTO(user: User) {
  return {
    id: user.id,
    email: user.email,
    hasVerifiedEmail: !!user.emailVerified,
    name: user.name,
    image: user.image,
    role: user.role,
  };
}

export type UserDTO = Awaited<ReturnType<typeof getUserDTO>>;
