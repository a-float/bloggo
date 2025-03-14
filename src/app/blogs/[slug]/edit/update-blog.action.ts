"use server";

import prisma from "@/lib/prisma";
import { Blog, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Input = Omit<Blog, "id">;

type ActionState = {
  success?: boolean;
  errors: { field?: keyof Input; message: string }[];
};

export async function updateBlog(
  prevState: ActionState,
  blogId: Blog["id"],
  data: Partial<Input>
): Promise<ActionState> {
  const errors: ActionState["errors"] = [];
  // TODO use zod
  if (!data.title)
    errors.push({ field: "title", message: "This field can't be empty." });
  if (!data.slug)
    errors.push({ field: "slug", message: "This field can't be empty." });
  if (!data.summary)
    errors.push({ field: "summary", message: "This field can't be empty." });
  if (!data.content)
    errors.push({ field: "content", message: "This field can't be empty." });

  const prev = await prisma.blog.findFirst({ where: { id: blogId } });
  if (!prev)
    return { success: false, errors: [{ message: "Blog doesn't exist." }] };

  if (errors.length) return { success: false, errors };

  await prisma.blog.update({
    where: { id: blogId },
    data: data as Prisma.BlogUpdateInput,
  });

  revalidatePath(`/blogs/${prev.slug}`);

  if (prev.slug !== data.slug) {
    redirect(`/blogs/${data.slug}/edit`);
  }

  return { success: true, errors: [] };
}
