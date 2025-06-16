"use server";

import { getFileUploader } from "@/lib/blobUploader";
import getUser from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { unauthorized } from "next/navigation";

export async function uploadFiles(
  formData: FormData
): Promise<{ url: string; name: string }[]> {
  const user = await getUser();
  if (!user) return unauthorized();

  const uploader = getFileUploader();
  const files = formData.getAll("file");
  const uploadPromises = files.map(async (file, idx) => {
    if (!file || !(file instanceof File)) throw new Error("No file provided");
    const data = { url: await uploader.upload(file as File), name: file.name };
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
