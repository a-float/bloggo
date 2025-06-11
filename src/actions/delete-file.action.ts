"use server";

import { getFileUploader } from "@/lib/blobUploader";
import getUser from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { notFound, unauthorized } from "next/navigation";

export async function deleteFile(url: string): Promise<void> {
  const user = await getUser();
  if (!user) return unauthorized();

  const uploader = getFileUploader();
  // TODO ImageDTO and getImageByUrl
  const image = await prisma.image.findUnique({
    where: { url },
    include: { blog: { include: { author: true } } },
  });
  if (!image) return notFound();
  if (image.blog?.authorId !== user.id && user.role !== Role.ADMIN)
    return unauthorized();

  await uploader.remove(url);
  await prisma.image.delete({ where: { url } });
}
