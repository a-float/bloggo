"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
// import { type MDXEditorMethods } from "@mdxeditor/editor";
// import { ForwardRefMDXEditor } from "@/components/mdx/ForwardRefMDXEditor";
import toast from "react-hot-toast";
import { deleteBlog } from "@/actions/delete-blog.action";
import { BlogWithCoverImage } from "@/types";
import { createBlog } from "@/actions/edit-create-blog.action";
import { uploadFile } from "@/actions/upload-file.action";
import { useRouter } from "next/navigation";
import { resizeImage } from "@/lib/resizeImage";
import { DayPickerInput } from "@/components/form/DayPickerInput";
import FileInput from "@/components/form/FileInput";
import { Textarea, Input } from "@/components/form/TextInput";
import Spinner from "@/components/Spinner";

type FormValues = {
  id: number;
  title: string;
  content: string;
  date?: Date | null;
  coverImage?: File | null;
};

export default function EditBlogForm({ blog }: { blog?: BlogWithCoverImage }) {
  // const editorRef = React.useRef<MDXEditorMethods | null>(null);
  const router = useRouter();
  const [previewImage, setPreviewImage] = React.useState<
    { name: string; url: string } | undefined
  >(blog?.coverImage ?? undefined);

  const [isPendingDelete, startDeleteTransition] = useTransition();
  const form = useForm<FormValues>({
    defaultValues: {
      id: blog?.id,
      title: blog?.title ?? "",
      content: blog?.content ?? "",
      date: blog?.date ?? null,
      coverImage: null,
    },
  });

  const uploadImageIfNeeded = async (image?: File | null) => {
    if (image && previewImage?.url !== blog?.coverImage?.url) {
      const resizedImage = await resizeImage(image, 1024, 1024);
      const formData = new FormData();
      formData.set("file", resizedImage);
      const newUrl = (await uploadFile(formData)).url;
      setPreviewImage({ name: image.name, url: newUrl });
      return newUrl;
    }
    return previewImage?.url;
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { coverImage, ...rest } = data;

    const blogData = {
      ...rest,
      coverImageUrl: await uploadImageIfNeeded(coverImage),
    };

    await createBlog(blogData).then((res) => {
      res.errors?.forEach((err) => {
        form.setError(err.field as keyof FormValues, { message: err.message });
      });
      if (res.success) {
        if (!rest.id && res.data) router.push(`/blogs/${res.data.slug}`);
        if (res.message) toast.success(res.message);
      } else if (res.message) {
        toast.error(res.message);
      }
    });
  };

  const onDelete = () => {
    if (!blog?.id) return;
    startDeleteTransition(() =>
      deleteBlog(blog.id).then((res) => {
        if (res.message) toast(res.message);
      })
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-row gap-8">
        <div className="mt-0 flex-2/3">
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  required
                  label="Content"
                  className="textarea w-full h-96"
                  {...field}
                />
                {/* <ForwardRefMDXEditor
                  ref={editorRef}
                  markdown={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  contentEditableClassName="prose mdx-prose-fix bg-base-200 max-w-none"
                /> */}
                {fieldState.error ? (
                  <p className="text-error">{fieldState.error?.message}</p>
                ) : null}
              </>
            )}
          />
        </div>
        <div className="flex-1/3">
          <Input
            {...form.register("title")}
            defaultValue={blog?.title ?? ""}
            label="Title"
            required
            className="w-full"
          />
          <Controller
            name="date"
            control={form.control}
            render={({ field }) => (
              <DayPickerInput
                {...form.register("date")}
                dayPickerProps={{
                  selected: field.value ?? undefined,
                  mode: "single",
                }}
                onChange={(date) => form.setValue("date", date ?? null)}
                label="Date"
                className="w-full"
              />
            )}
          />

          <FileInput
            name="coverImage"
            accept="image/png, image/jpeg"
            label="Pick the cover image"
            className="w-full"
            preview={previewImage}
            onClear={() => {
              form.setValue("coverImage", null);
              setPreviewImage(undefined);
            }}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (!file) {
                form.setValue("coverImage", null);
                setPreviewImage(undefined);
              } else {
                const url = URL.createObjectURL(file);
                setPreviewImage({ name: file.name, url });
                form.setValue("coverImage", file);
              }
            }}
          />
          <div className="flex gap-4 mt-4">
            {blog?.slug ? (
              <Link
                className="btn btn-primary btn-outline"
                href={`/blogs/${blog.slug}`}
              >
                Go back
              </Link>
            ) : null}
            <button className="btn btn-primary" type="submit">
              {form.formState.isSubmitting ? <Spinner /> : "Save"}
            </button>
            <div className="flex-1" />
            {blog?.id ? (
              <button
                type="button"
                className="btn btn-error btn-soft"
                onClick={onDelete}
              >
                {isPendingDelete ? <Spinner /> : "Delete"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}
