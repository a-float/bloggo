"use server";

import { getFileUploader } from "@/lib/blobUploader";
import prisma from "@/lib/prisma";

export async function deleteFile(url: string): Promise<void> {
  const uploader = getFileUploader();
  await uploader.remove(url);
  await prisma.image.delete({ where: { url } });
}
