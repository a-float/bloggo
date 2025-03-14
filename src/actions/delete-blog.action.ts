"use server";

import prisma from "@/lib/prisma";
import { Blog } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = {
  success?: boolean;
  message?: string;
};

export async function deleteBlog(blogId: Blog["id"]): Promise<ActionState> {
  try {
    const blog = await prisma.blog.delete({ where: { id: blogId } });
    revalidatePath(`/blogs/${blog.slug}`);
  } catch (e) {
    console.error(e);
    return { success: false, message: "Could not delete the blog." };
  }
  redirect(`/blogs`);
}
