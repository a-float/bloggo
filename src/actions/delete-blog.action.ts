"use server";

import { canUserEditBlog } from "@/data/access";
import { getBlogById } from "@/data/blog-dto";
import { getFileUploader } from "@/lib/blobUploader";
import getUser from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { Blog } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, unauthorized } from "next/navigation";

type ActionState = {
  success?: boolean;
  message?: string;
};

export async function deleteBlog(blogId: Blog["id"]): Promise<ActionState> {
  const user = await getUser();
  if (!user) return unauthorized();
  const blog = await getBlogById(blogId);
  if (!blog) return notFound();
  if (canUserEditBlog(user, blog)) unauthorized();

  const uploader = getFileUploader();

  try {
    await prisma.blog.delete({
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
