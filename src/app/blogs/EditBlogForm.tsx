"use client";

import React from "react";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
// import { type MDXEditorMethods } from "@mdxeditor/editor";
// import { ForwardRefMDXEditor } from "@/components/mdx/ForwardRefMDXEditor";
import toast from "react-hot-toast";
import { deleteBlog } from "@/actions/delete-blog.action";
import { createBlog } from "@/actions/edit-create-blog.action";
import { useRouter } from "next/navigation";
import { resizeImage } from "@/lib/resizeImage";
import { DayPickerInput } from "@/components/form/DayPickerInput";
import FileInput from "@/components/form/FileInput";
import { Textarea, Input } from "@/components/form/TextInput";
import Spinner from "@/components/Spinner";
import { BlogDTO } from "@/data/blog-dto";
import TagSelect from "@/components/TagSelect";
import { TagWithCount } from "@/types";
import { objectToFormData } from "@/lib/formData";
import { BlogVisibility } from "@prisma/client";
import { Select } from "@/components/form/Select";

type FormValues = {
  id: number | null;
  title: string;
  content: string;
  tags: string[];
  date: Date | null;
  images: File[];
  visibility: BlogVisibility;
};

type EditBlogFormProps = {
  blog?: BlogDTO;
  tagCounts: TagWithCount[];
};

export default function EditBlogForm({ blog, tagCounts }: EditBlogFormProps) {
  const router = useRouter();
  const [previewImages, setPreviewImages] = React.useState(blog?.images ?? []);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [waitingForRedirect, setWaitingForRedirect] = React.useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      id: blog?.id ?? null,
      title: blog?.title ?? "",
      tags: blog?.tags ?? [],
      content: blog?.content ?? "",
      date: blog?.date || null,
      images: [],
      visibility: blog?.visibility ?? BlogVisibility.FRIENDS,
    },
  });

  const isSubmitting = form.formState.isSubmitting || waitingForRedirect;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = objectToFormData({
      ...data,
      images: await Promise.all(
        data.images.map((file) => resizeImage(file, 1024, 1024))
      ),
    });
    await createBlog(formData).then((res) => {
      res.errors?.forEach((err) => {
        if (err.field === "id") return;
        form.setError(err.field as keyof FormValues, { message: err.message });
      });
      if (res.success) {
        if (!data.id && res.data) {
          setWaitingForRedirect(true);
          router.push(`/blogs/${res.data.slug}`);
        }
        if (res.message) toast.success(res.message);
      } else if (res.message) {
        toast.error(res.message);
      } else {
        toast.error("An error occurred while saving the blog.");
      }
    });
  };

  const onDelete = () => {
    if (!blog?.id) return;
    setIsDeleting(true);
    deleteBlog(blog.id)
      .then((res) => {
        if (res.success) {
          router.push("/blogs");
          if (res.message) toast.success(res.message);
        } else {
          if (res.message) toast.error(res.message);
        }
      })
      .catch(() => {
        toast.error("An error occurred while deleting the blog.");
        setIsDeleting(false);
      });
  };

  const handleImagesClear = () => {
    previewImages.forEach((image) => URL.revokeObjectURL(image.url));
    setPreviewImages([]);
    form.setValue("images", []);
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
          <Select
            label={"Blog visibility"}
            {...form.register("visibility")}
            className="w-full"
            required
          >
            <option value={BlogVisibility.PUBLIC}>Everyone</option>
            <option value={BlogVisibility.FRIENDS}>Friends only</option>
            <option value={BlogVisibility.PRIVATE}>Just me</option>
          </Select>
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
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
                {fieldState.error?.message ? (
                  <p className="text-error text-sm">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
          <FileInput
            name="images"
            accept="image/png, image/jpeg"
            multiple
            label="Attach images"
            className="w-full"
            previews={previewImages}
            onClear={handleImagesClear}
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (!files.length) {
                handleImagesClear();
              } else {
                setPreviewImages(
                  files.map((file) => ({
                    name: file.name,
                    url: URL.createObjectURL(file),
                  }))
                );
                form.setValue("images", files);
              }
            }}
          />
          <Controller
            name="tags"
            control={form.control}
            render={({ field }) => (
              <TagSelect
                tagCounts={tagCounts}
                selectedTags={field.value}
                maxResults={8}
                onChange={(tags) => field.onChange(tags)}
              />
            )}
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
            <button className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Save"}
            </button>
            <div className="flex-1" />
            {blog?.id ? (
              <button
                type="button"
                disabled={isDeleting}
                className="btn btn-error btn-soft"
                onClick={onDelete}
              >
                {isDeleting ? <Spinner /> : "Delete"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}
