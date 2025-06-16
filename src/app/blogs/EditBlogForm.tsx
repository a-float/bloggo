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
import { Textarea, Input } from "@/components/form/TextInput";
import Spinner from "@/components/Spinner";
import { BlogDTO } from "@/data/blog-dto";
import TagSelect from "@/components/TagSelect";
import { TagWithCount } from "@/types";
import { BlogVisibility } from "@prisma/client";
import { Select } from "@/components/form/Select";
import { uploadFiles } from "@/actions/upload-files.action";
import { BlobManager } from "@/lib/blobManager";
import { type ItemInterface, ReactSortable } from "react-sortablejs";
import { LegendLabel } from "@/components/form/common";

type FormValues = {
  id: number | null;
  title: string;
  content: string;
  tags: string[];
  date: Date | null;
  visibility: BlogVisibility;
};

type EditBlogFormProps = {
  blog?: BlogDTO;
  tagCounts: TagWithCount[];
};

type SortableImage = ItemInterface & { url: string };

export default function EditBlogForm({ blog, tagCounts }: EditBlogFormProps) {
  const router = useRouter();
  const blobManagerRef = React.useRef(new BlobManager());

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [waitingForRedirect, setWaitingForRedirect] = React.useState(false);
  const [imagePreviews, setImagePreviews] = React.useState<SortableImage[]>(
    blog?.images ?? []
  );

  const form = useForm<FormValues>({
    defaultValues: {
      id: blog?.id ?? null,
      title: blog?.title ?? "",
      tags: blog?.tags ?? [],
      content: blog?.content ?? "",
      date: blog?.date || null,
      visibility: blog?.visibility ?? BlogVisibility.FRIENDS,
    },
  });

  const isSubmitting = form.formState.isSubmitting || waitingForRedirect;

  const uploadNewImages = async (images: typeof imagePreviews) => {
    const formData = new FormData();
    for (const image of images) {
      const file = blobManagerRef.current.getObjectForUrl(image.url);
      if (!file) continue;
      const resizedImage = await resizeImage(file as File, 1024, 1024);
      formData.append("file", resizedImage);
    }
    const uploaded = await uploadFiles(formData);
    let i = 0;
    return images.map((image, idx) => ({
      order: idx,
      name: image.name,
      url: blobManagerRef.current.getObjectForUrl(image.url)
        ? uploaded[i++].url
        : image.url,
    }));
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const body = { ...data, images: await uploadNewImages(imagePreviews) };
    await createBlog(body).then((res) => {
      res.errors?.forEach((err) => {
        if (err.field === "id") return;
        form.setError(err.field as keyof FormValues, { message: err.message });
      });
      if (res.success) {
        if (!data.id && res.data) {
          // If this is a new blog, redirect to the new blog page
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
          <fieldset className="fieldset">
            <LegendLabel>Attach images</LegendLabel>
            <input
              type="file"
              className="file-input w-full"
              key={imagePreviews.length}
              name="imageFiles"
              accept="image/png, image/jpeg"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (!files.length) return;
                const newFiles = files.map((file) => {
                  const url = blobManagerRef.current.createObjectURL(file);
                  return { name: file.name, url, id: url };
                });
                setImagePreviews((prev) => [...newFiles, ...prev]);
              }}
            />
            <ReactSortable list={imagePreviews} setList={setImagePreviews}>
              {imagePreviews.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center gap-2 cursor-grab hover:bg-base-200 p-1 px-2">
                    <img
                      className="h-[36px] w-[36px] text-info rounded-sm object-cover"
                      alt=""
                      src={item.url}
                    />
                    <span>{item.name}</span>
                    <div className="flex-1" />
                    <button
                      className="btn btn-xs btn-soft btn-error"
                      onClick={() =>
                        setImagePreviews((prev) =>
                          prev.filter((x) => x.url !== item.url)
                        )
                      }
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          </fieldset>
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
