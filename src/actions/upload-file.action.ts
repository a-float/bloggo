"use server";

import { getFileUploader } from "@/lib/blobUploader";
import getUser from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { unauthorized } from "next/navigation";

export async function uploadFile(formData: FormData): Promise<{ url: string }> {
  const user = await getUser();
  if (!user) return unauthorized();

  const uploader = getFileUploader();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) throw new Error("No file provided");
  const url = await uploader.upload(file as File);
  await prisma.image.create({
    data: { owner: { connect: { id: user.id } }, name: file.name, url },
  });
  return { url };
}
