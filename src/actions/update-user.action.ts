"use server";

import { getUserDTO, UserDTO } from "@/data/user-dto.ts";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";
import { hash } from "bcrypt";
import { unauthorized } from "next/navigation";

export async function updateUser(data: {
  name?: string;
  password?: string;
}): Promise<UserDTO> {
  if (!data.name && !data.password) {
    throw new Error("Invalid data");
  }
  const { user } = await getSession();
  if (!user) unauthorized();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id, email: user.email },
  });
  if (!dbUser) unauthorized();

  const updateUserData: Prisma.UserUpdateInput = {
    password: data?.password ? await hash(data.password, 10) : undefined,
    name: data.name ? data.name : undefined,
  };

  console.log("updating user", user, "with", updateUserData);
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateUserData,
  });

  return getUserDTO(updatedUser);
}
