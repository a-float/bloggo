"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<void> {
  if (!data.name || !data.email || !data.password) {
    throw new Error("Invalid data");
  }
  const passwordHash = await hash(data.password, 10);
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash,
    },
  });
}
