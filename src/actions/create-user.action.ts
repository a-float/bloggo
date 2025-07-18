"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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
  try {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: passwordHash,
      },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      throw new Error("User with this email already exists");
    }
    console.error(e);
    throw new Error("Something went wrong");
  }
}
