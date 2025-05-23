"use server";

import { getFileUploader } from "@/lib/blobUploader";
import prisma from "@/lib/prisma";
import { Blog } from "@prisma/client";
import { revalidatePath } from "next/cache";

type ActionState = {
  success?: boolean;
  message?: string;
};

export async function deleteBlog(blogId: Blog["id"]): Promise<ActionState> {
  try {
    const uploader = getFileUploader();
    const blog = await prisma.blog.delete({
      where: { id: blogId },
      include: { coverImage: true },
    });
    if (blog.coverImage?.url) uploader.remove(blog.coverImage.url);
    revalidatePath(`/blogs/${blog.slug}`);
  } catch (e) {
    console.error(e);
    return { success: false, message: "Could not delete the blog." };
  }
  return { success: true, message: "Blog deleted successfully." };
}
