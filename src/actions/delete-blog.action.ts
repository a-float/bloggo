"use server";

import { canUserEditBlog } from "@/data/access";
import { getBlogById } from "@/lib/service/blog.service";
import { createBlobStorage } from "@/lib/blob";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Blog } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, unauthorized } from "next/navigation";

type ActionState = {
  success?: boolean;
  message?: string;
};

export async function deleteBlog(blogId: Blog["id"]): Promise<ActionState> {
  const { user } = await getSession();
  if (!user) return unauthorized();
  const blog = await getBlogById(blogId);
  if (!blog) return notFound();
  if (!canUserEditBlog(user, blog)) unauthorized();

  const storage = createBlobStorage();

  try {
    await prisma.blog.delete({
      where: { id: blogId },
      include: { images: true },
    });
    for (const image of blog.images) {
      storage.remove(image.url);
    }
    revalidatePath(`/blogs/${blog.slug}`);
  } catch (e) {
    console.error(e);
    return { success: false, message: "Could not delete the blog." };
  }
  return { success: true, message: "Blog deleted successfully." };
}
