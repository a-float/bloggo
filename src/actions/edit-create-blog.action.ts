"use server";

import prisma from "@/lib/prisma";
import * as yup from "yup";
import { Blog, BlogVisibility, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import getUser from "@/lib/getUser";
import { getBlogById } from "@/lib/service/blog.service";
import { canUserCreateBlog, canUserEditBlog } from "@/data/access";
import { getFileUploader } from "@/lib/blobUploader";

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
  images: yup.array().of(yup.mixed<File>().required()).default([]),
  visibility: yup.string().oneOf(Object.values(BlogVisibility)).required(),
  date: yup.date().nullable(),
});

const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

// Wish I could return 401 for unauthorized access and 404 for not found, but Next.js doesn't let me do that :(

function formDataToObject(formData: FormData) {
  return {
    id: formData.get("id") ? formData.get("id") : null,
    title: formData.get("title"),
    tags: formData.getAll("tags").map((tag) => tag.toString().trim()),
    content: formData.get("content"),
    images: formData.getAll("images"),
    visibility: formData.get("visibility"),
    date: formData.get("date")
      ? new Date(formData.get("date") as string)
      : null,
  };
}

async function uploadImages(images: File[]) {
  const fileUploader = getFileUploader();
  return await Promise.all(
    images.map(async (image) => ({
      url: await fileUploader.upload(image),
      name: image.name,
    }))
  );
}

export async function createBlog(formData: FormData): Promise<ActionState> {
  const user = await getUser();
  if (!user) return { success: false, message: "Access denied." };
  const errors: ActionState["errors"] = [];

  const input = formDataToObject(formData);
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
  const uploadedImages = await uploadImages(images);
  const dataNoImages: Prisma.BlogCreateInput = {
    ...rest,
    tags: [...new Set(tags ?? [])],
  };

  if (!id) {
    if (!canUserCreateBlog(user)) {
      return { success: false, message: "Access denied." };
    }
    const blog = await prisma.blog.create({
      data: {
        ...dataNoImages,
        images: { create: uploadedImages },
        author: { connect: { id: user.id } },
      },
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
    // Remove all old images
    await Promise.all(
      oldBlog.images.map((image) => getFileUploader().remove(image.url))
    );
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...dataNoImages,
        images: { deleteMany: {}, create: uploadedImages },
      },
    });
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.slug}`);
    return { success: true, message: "Blog updated successfully.", data: blog };
  }
}
