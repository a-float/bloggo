"use server";

import prisma from "@/lib/prisma";
import * as yup from "yup";
import { Blog, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import getUser from "@/lib/getUser";
import { getBlogById } from "@/data/blog-dto";
import { canUserCreateBlog, canUserEditBlog } from "@/data/access";

export type ActionState = {
  success: boolean;
  message?: string;
  data?: Blog;
  errors?: { field: string; message: string }[];
};

const CreateBlogSchema = yup.object({
  id: yup.number().optional(),
  title: yup.string().required().trim().min(1),
  content: yup.string().required().trim().min(1),
  coverImageUrl: yup.string().nullable(),
  date: yup.date().nullable(),
});

type CreateBlogInput = yup.InferType<typeof CreateBlogSchema>;

const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

// Wish I could return 401 for unauthorized access and 404 for not found, but Next.js doesn't let me do that :(

export async function createBlog(input: CreateBlogInput): Promise<ActionState> {
  const user = await getUser();
  if (!user) return { success: false, message: "Access denied." };
  const errors: ActionState["errors"] = [];

  const parsedInput = await CreateBlogSchema.validate(input, {
    abortEarly: false,
  }).catch((e: yup.ValidationError) => {
    e.inner.forEach((inner) => {
      if (!inner.path || !inner.message) return;
      errors.push({ field: inner.path, message: capitalize(inner.message) });
    });
  });

  if (errors.length > 0 || !parsedInput) return { success: false, errors };

  const { id, coverImageUrl, ...rest } = parsedInput;
  const data: Prisma.BlogCreateInput = {
    ...rest,
    tags: [...new Set(rest.content.matchAll(/#\w+/g).map((m) => m[0]))],
    coverImage: coverImageUrl ? { connect: { url: coverImageUrl } } : undefined,
  };

  if (!id) {
    if (!canUserCreateBlog(user)) {
      return { success: false, message: "Access denied." };
    }
    const blog = await prisma.blog.create({
      data: { ...data, author: { connect: { id: user.id } } },
    });
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.slug}`);
    return { success: true, message: "Blog updated successfully.", data: blog };
  } else {
    const oldBlog = await getBlogById(id);
    if (!oldBlog) {
      return { success: false, message: "Blog not found." };
    }
    if (!canUserEditBlog(user, oldBlog)) {
      return { success: false, message: "Access denied." };
    }
    const blog = await prisma.blog.update({ where: { id }, data });
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.slug}`);
    return { success: true, message: "Blog updated successfully.", data: blog };
  }
}
