"use client";

import { updateCreateBlog } from "@/actions/update-create-blog.action";
import React, { useTransition } from "react";
import Link from "next/link";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import { ForwardRefMDXEditor } from "@/components/mdx/ForwardRefMDXEditor";
import { Input, Textarea, DayPickerInput, FileInput } from "@/components/Input";
import toast from "react-hot-toast";
import { deleteBlog } from "@/actions/delete-blog.action";
import { BlogWithCoverImage } from "@/types";
// import { useForm } from "react-hook-form";

export default function EditBlogForm({
  blog,
}: {
  blog: Partial<BlogWithCoverImage>;
}) {
  const editorRef = React.useRef<MDXEditorMethods | null>(null);
  const [state, formAction, isPending] = React.useActionState<
    ReturnType<typeof updateCreateBlog>,
    FormData
  >(updateCreateBlog, {});

  const errors: Record<string, string> = (state.errors ?? []).reduce(
    (acc, err) => ({ ...acc, [err.field]: err.message }),
    {}
  );

  // const form = useForm({
  //   defaultValues: {
  //     ...blog,
  //     coverImage: blog.coverImage?.url,
  //     tags: undefined,
  //   },
  // });

  const [isPendingDelete, startDeleteTransition] = useTransition();

  React.useEffect(() => {
    if (state.message) {
      if (state.success) toast.success(state.message);
      else toast.error(state.message);
    }
  }, [state]);

  const handleAction = (formData: FormData) => {
    const content = editorRef.current?.getMarkdown() ?? "";
    const tags = [...content.matchAll(/#\w+/g).map((m) => m[0])];
    console.log(tags);
    formData.set("content", content);
    tags.forEach((tag) => formData.append("tags", tag));
    // for (const [url, blob] of Object.entries(blobManager.getAllBlobs())) {
    //   console.log("attaching", { url, blob });
    //   if (!blob) continue;
    //   formData.append("blobUrls", url);
    //   formData.append("blobs", blob);
    // }
    // TODO fix in form
    const img = formData.get("coverImage") as File | undefined;
    if (img?.size === 0) formData.delete("coverImage");
    formAction(formData);
  };

  console.log("front blog", blog);

  return (
    <form action={handleAction}>
      <div className="flex flex-row gap-8">
        <div className="mt-4 flex-2/3">
          <ForwardRefMDXEditor
            ref={editorRef}
            markdown={blog.content ?? ""}
            contentEditableClassName="prose mdx-prose-fix bg-base-200 max-w-none"
          />
          {errors.content ? (
            <p className="text-error">{errors.content}</p>
          ) : null}
        </div>
        <div className="flex-1/3">
          <input name="id" value={blog.id} type="hidden" />
          <Input
            label="Title"
            name="title"
            required
            className="input w-full"
            error={errors.title}
          />
          <DayPickerInput
            label="Date"
            name="date"
            defaultValue={blog.date?.toISOString()}
            error={errors.date}
          />
          <FileInput
            name="coverImage"
            defaultValue={""}
            accept="image/png, image/jpeg"
            label="Pick the cover image"
            showImage
            error={errors.coverImage}
            defaultUrl={blog.coverImage?.url ?? undefined}
          />
          <Input
            name="slug"
            label="Slug"
            className="input w-full"
            defaultValue={blog.slug}
            error={errors.slug}
          />
          <Textarea
            label="Summary"
            name="summary"
            required
            className="textarea h-24 w-full"
            defaultValue={blog.summary}
            error={errors.summary}
          />

          <div className="flex gap-4 mt-4">
            <Link
              className="btn btn-primary btn-outline"
              href={`/blogs/${blog.slug}`}
            >
              Go back
            </Link>
            <button className="btn btn-primary">
              {isPending ? (
                <span className="loading loading-spinner" />
              ) : (
                "Save"
              )}
            </button>
            <div className="flex-1" />
            {blog.id ? (
              <button
                className="btn btn-error btn-soft"
                onClick={() =>
                  startDeleteTransition(async () => {
                    if (!blog.id) return;
                    const res = await deleteBlog(blog.id);
                    if (res.message) toast(res.message);
                  })
                }
              >
                {isPendingDelete ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Delete"
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}
