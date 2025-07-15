"use server";

import { createBlobStorage } from "@/lib/blob";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { unauthorized } from "next/navigation";

export async function uploadFiles(
  formData: FormData
): Promise<{ url: string; name: string }[]> {
  const { user } = await getSession();
  if (!user) return unauthorized();

  const storage = createBlobStorage();
  const files = formData.getAll("file");
  const uploadPromises = files.map(async (file) => {
    if (!file || !(file instanceof File)) throw new Error("No file provided");
    const data = { url: await storage.upload(file as File), name: file.name };
    await prisma.image.create({
      data: {
        ...data,
        order: 0,
        owner: { connect: { id: user.id } },
      },
    });
    return data;
  });

  // TODO error handling?
  return await Promise.all(uploadPromises);
}
