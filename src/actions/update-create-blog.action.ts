"use server";

import prisma from "@/lib/prisma";
import { Blog, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Input = Omit<Blog, "id">;

type ActionState = {
  success?: boolean;
  message?: string;
  errors?: { field: keyof Input; message: string }[];
};

export async function updateCreateBlog(
  prevState: ActionState,
  blogId: Blog["id"] | null,
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

  if (errors.length) return { success: false, errors };

  if (!blogId) {
    await prisma.blog.create({ data: data as Prisma.BlogCreateInput });
    revalidatePath("/blogs");
    redirect(`/blogs/${data.slug}`);
    // return { success: true, message: "Blog created successfully" };
  }

  const prev = await prisma.blog.findFirst({ where: { id: blogId } });
  if (!prev) return { success: false, message: "Blog doesn't exist." };

  await prisma.blog.update({
    where: { id: blogId },
    data: data as Prisma.BlogUpdateInput,
  });

  revalidatePath(`/blogs/${prev.slug}`);

  if (prev.slug !== data.slug) {
    redirect(`/blogs/${data.slug}/edit`);
  }

  return { success: true, message: "Blog updated successfully." };
}
