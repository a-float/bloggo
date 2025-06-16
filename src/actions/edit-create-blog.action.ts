"use server";

import prisma from "@/lib/prisma";
import * as yup from "yup";
import { Blog, BlogVisibility, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import getUser from "@/lib/getUser";
import { getBlogById } from "@/lib/service/blog.service";
import { canUserCreateBlog, canUserEditBlog } from "@/data/access";

export type ActionState = {
  success: boolean;
  message?: string;
  data?: Blog;
  errors?: { field: string; message: string }[];
};

const CreateBlogSchema = yup.object({
  id: yup.number().nullable(),
  title: yup.string().required().trim().min(1),
  tags: yup.array().of(yup.string().trim().required()),
  content: yup.string().required().trim().min(1),
  images: yup
    .array()
    .of(
      yup.object({
        url: yup.string().required(),
        order: yup.number().required(),
      })
    )
    .required(),
  visibility: yup.string().oneOf(Object.values(BlogVisibility)).required(),
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

  const { id, tags, images, ...rest } = parsedInput;

  const data: Prisma.BlogCreateInput = {
    ...rest,
    tags: [...new Set(tags ?? [])],
  };

  const imagesWhere: Prisma.ImageWhereUniqueInput[] = images.map((image) => ({
    url: image.url,
  }));

  const updateImagesOrder = () =>
    images.map((image) =>
      prisma.image.update({
        data: { order: image.order },
        where: { url: image.url },
      })
    );

  if (!id) {
    // Creating a new blog
    if (!canUserCreateBlog(user)) {
      return { success: false, message: "Access denied." };
    }
    const [blog] = await prisma.$transaction([
      prisma.blog.create({
        data: {
          ...data,
          images: { connect: imagesWhere },
          author: { connect: { id: user.id } },
        },
      }),
      ...updateImagesOrder(),
    ]);

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.slug}`);
    return { success: true, message: "Blog updated successfully.", data: blog };
  } else {
    // Editing an existing blog
    const oldBlog = await getBlogById(id);
    if (!oldBlog) {
      return { success: false, message: "Blog not found." };
    }
    if (!canUserEditBlog(user, oldBlog)) {
      return { success: false, message: "Access denied." };
    }

    const [blog] = await prisma.$transaction([
      prisma.blog.update({
        where: { id },
        data: { ...data, images: { set: imagesWhere } },
      }),
      ...updateImagesOrder(),
    ]);

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.slug}`);
    return { success: true, message: "Blog updated successfully.", data: blog };
  }
}
