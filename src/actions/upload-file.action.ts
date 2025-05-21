"use server";

import { getFileUploader } from "@/lib/blobUploader";
import prisma from "@/lib/prisma";

export async function uploadFile(formData: FormData): Promise<{ url: string }> {
  const uploader = getFileUploader();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) throw new Error("No file provided");
  const url = await uploader.upload(file as File);
  await prisma.image.create({ data: { name: file.name, url } });
  return { url };
}
