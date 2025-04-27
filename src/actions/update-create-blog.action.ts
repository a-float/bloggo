"use server";

import { getFileUploader } from "@/lib/blobUploader";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as yup from "yup";

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: { field: string; message: string }[];
  prevData?: FormData;
};

const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

// TODO date shifted two hours

const fileSchema = () =>
  yup.mixed<File>().test({
    message: "Please provide a valid file",
    test: (file) => !file || (file.name !== "undefined" && file.size > 0),
  });

const BlogInputSchema = yup.object({
  id: yup.number().transform((val) => (isNaN(val) ? undefined : val)),
  title: yup.string().required().trim().min(3),
  slug: yup.string(),
  summary: yup.string().required().trim().min(10),
  content: yup.string().required(),
  coverImage: fileSchema(),
  date: yup.date(),
});

export async function updateCreateBlog(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const errors: ActionState["errors"] = [];

  const raw: Record<string, FormDataEntryValue | FormDataEntryValue[]> =
    Object.fromEntries(formData);
  raw.tags = formData.getAll("tags");

  const inputData = await BlogInputSchema.validate(raw, {
    abortEarly: false,
  }).catch((e: yup.ValidationError) => {
    e.inner.forEach((inner) => {
      if (!inner.path || !inner.message) return;
      errors.push({ field: inner.path, message: capitalize(inner.message) });
    });
  });

  if (errors.length > 0 || !inputData) {
    console.log("on validation", errors);
    return {
      prevData: formData,
      success: false,
      errors,
      message: inputData ? undefined : "Oops, something went wrong :(",
    };
  }

  const prev =
    inputData.id !== undefined
      ? await prisma.blog.findFirst({
          where: { id: inputData.id },
          include: { coverImage: true },
        })
      : undefined;

  const uploader = getFileUploader();
  console.log("got uploader", uploader);

  const parsedData = {
    ...inputData,
    slug: inputData.title
      .toLowerCase()
      .replaceAll(/\s+/g, "-")
      .replaceAll(/[^a-z0-9-]/g, ""),
  };

  if (parsedData.coverImage && prev?.coverImage) {
    console.log("Removing", prev.coverImage.url);
    await uploader.remove(prev.coverImage.url).catch((e) => {
      console.warn("Could not remove file", e);
    });
  }

  const uploadedImg = parsedData.coverImage
    ? {
        name: parsedData.coverImage.name,
        url: await uploader.upload(parsedData.coverImage),
      }
    : undefined;

  // const blobUrls = formData.getAll("blobUrls");
  // const blobs = formData.getAll("blobs");

  // const blobUploader = new LocalBlobUploader();
  // for (let i = 0; i < blobs.length; i++) {
  //   const [url, blob] = [blobUrls[i], blobs[i]];
  //   if (typeof url === "string" && blob instanceof Blob) {
  //     const uploadedUrl = await blobUploader.upload(blob);
  //     const adjustedUrl = url.replace("blob:", "blob\\:");
  //     data.content = data.content.replace(adjustedUrl, uploadedUrl);
  //     data.content = data.content.replace(url, uploadedUrl);
  //     console.log({ url });
  //     console.log("replacing", adjustedUrl, "with", uploadedUrl);
  //   }
  // }

  if (!prev) {
    const newBlog = await prisma.blog.create({
      data: { ...parsedData, coverImage: { create: uploadedImg } },
    });
    revalidatePath("/blogs");
    redirect(`/blogs/${newBlog.slug}`);
  }

  const newBlog = await prisma.blog.update({
    where: { id: prev.id },
    data: {
      ...parsedData,
      coverImage: !uploadedImg
        ? undefined
        : {
            upsert: {
              where: { blogId: prev.id },
              create: uploadedImg,
              update: uploadedImg,
            },
          },
    },
  });
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${newBlog.slug}`);
  if (prev.slug !== newBlog.slug) redirect(`/blogs/${newBlog.slug}/edit`);
  return {
    prevData: formData,
    success: true,
    message: "Blog updated successfully.",
  };
}
