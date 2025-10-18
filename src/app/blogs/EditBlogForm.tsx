"use client";

import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import MarkdownEditor from "@/components/md/MarkdownEditor";
import toast from "react-hot-toast";
import { deleteBlog } from "@/actions/delete-blog.action";
import { createOrUpdateBlog } from "@/actions/edit-create-blog.action";
import { useRouter } from "next/navigation";
import { DayPickerInput } from "@/components/form/DayPickerInput";
import { Input } from "@/components/form/TextInput";
import Spinner from "@/components/Spinner";
import { BlogDTO } from "@/data/blog-dto";
import TagSelect from "@/components/TagSelect";
import { type TagWithCount } from "@/types/common";
import { BlogVisibility } from "@prisma/client";
import { Select } from "@/components/form/Select";
import { BlobManager } from "@/lib/blob/blob-manager";
import { FaChevronLeft } from "react-icons/fa6";
import { uploadNewContentImages } from "./uploadNewContentImages";
import SortableImageInput, { SortableImage } from "./SortableImageInput";
import { uploadNewImages } from "./uploadNewImages";

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

export default function EditBlogForm({ blog, tagCounts }: EditBlogFormProps) {
  const router = useRouter();
  const blobManagerRef = React.useRef(BlobManager.getInstance());

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [waitingForRedirect, setWaitingForRedirect] = React.useState(false);
  const [coverImagePreview, setCoverImagePreview] =
    React.useState<SortableImage | null>(blog?.coverImage ?? null);

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { content, images: contentImages } = await uploadNewContentImages(
      data.content,
      blobManagerRef.current
    );

    const [coverImage] = coverImagePreview
      ? await uploadNewImages([coverImagePreview], blobManagerRef.current)
      : [undefined];

    const prevImages = blog?.images || [];
    const prevImagesStillInContent = prevImages.filter((img) =>
      content.match(new RegExp(img.url, "g"))
    );

    const body = {
      ...data,
      content,
      coverImage,
      images: [...prevImagesStillInContent, ...contentImages],
    };

    await createOrUpdateBlog(body).then((res) => {
      res.errors?.forEach((err) => {
        if (err.field === "id") return;
        form.setError(err.field as keyof FormValues, { message: err.message });
      });
      if (res.success) {
        form.reset(body);
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

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.formState.isDirty]);

  return (
    <>
      <div className="flex gap-4 items-center mb-6">
        {!!blog?.slug && (
          <a className="btn btn-sm btn-soft" href={`/blogs/${blog.slug}`}>
            <FaChevronLeft /> <span className="sr-only">Go back</span>
          </a>
        )}
        <h1 className="text-3xl">
          {blog?.id ? (
            <span>
              Edit <span className="font-bold">{blog.title}</span>
            </span>
          ) : (
            "Create new blog"
          )}
        </h1>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1"
      >
        <div className="lg:flex gap-8 lg:[&_fieldset:not(:last-child)]:mb-1">
          <div className="flex flex-col flex-[2]">
            <Input
              {...form.register("title")}
              defaultValue={blog?.title ?? ""}
              label="Title"
              required
              className="w-full"
            />
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <MarkdownEditor
                  label="Content"
                  required
                  onChange={(md) => {
                    // for formState.isDirty
                    field.onChange({ target: { value: md } });
                  }}
                  defaultValue={blog?.content ?? ""}
                  value={field.value}
                  error={fieldState.error}
                />
              )}
            />
          </div>
          <div className="flex-1">
            <Select
              label={"Blog visibility"}
              defaultValue={form.formState.defaultValues?.visibility}
              {...form.register("visibility")}
              className="w-full"
              required
            >
              <option value={BlogVisibility.PUBLIC}>🌍 Everyone</option>
              <option value={BlogVisibility.FRIENDS}>🧑‍🤝‍🧑 Friends only</option>
              <option value={BlogVisibility.PRIVATE}>🔒 Just me</option>
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
            <SortableImageInput
              images={coverImagePreview ? [coverImagePreview] : []}
              setImages={(images) => setCoverImagePreview(images[0])}
              blobManagerRef={blobManagerRef}
            />
            <Controller
              name="tags"
              control={form.control}
              render={({ field }) => (
                <TagSelect
                  tagCounts={tagCounts}
                  selectedTags={field.value}
                  onChange={(tags) => field.onChange(tags)}
                />
              )}
            />
            <div className="flex justify-between mt-4">
              {!!blog?.id && (
                <button
                  type="button"
                  disabled={isDeleting}
                  className="btn btn-error btn-soft"
                  onClick={onDelete}
                >
                  {isDeleting ? <Spinner /> : "Delete"}
                </button>
              )}
              <div className="flex-1" />
              <button className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
