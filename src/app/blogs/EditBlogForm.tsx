"use client";

import { Blog } from "@prisma/client";
import { updateCreateBlog } from "@/actions/update-create-blog.action";
import React, { useTransition } from "react";
import Link from "next/link";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import { useForm } from "react-hook-form";
import { ForwardRefMDXEditor } from "@/components/ForwardRefMDXEditor";
import { Input, Textarea } from "@/components/Input";
import toast from "react-hot-toast";
import { deleteBlog } from "@/actions/delete-blog.action";

type Inputs = Parameters<typeof updateCreateBlog>[2];

export default function EditBlogForm({ blog }: { blog: Partial<Blog> }) {
  const editorRef = React.useRef<MDXEditorMethods | null>(null);
  const [state, formAction, isPending] = React.useActionState<
    ReturnType<typeof updateCreateBlog>,
    Inputs
  >((state, data) => updateCreateBlog(state, blog.id ?? null, data), {});

  const [isPendingDelete, startDeleteTransition] = useTransition();
  const form = useForm<Inputs>({ defaultValues: blog });

  const onSubmit = (data: Inputs) =>
    React.startTransition(() => formAction(data));

  React.useEffect(() => {
    state.errors?.forEach((e) => {
      form.setError(e.field, { message: e.message });
    });
    if (state.message) {
      if (state.success) toast.success(state.message);
      else toast.error(state.message);
    }
  }, [state, form]);

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-row gap-8">
        <div className="mt-4 flex-2/3">
          <ForwardRefMDXEditor
            ref={editorRef}
            markdown={blog.content ?? ""}
            contentEditableClassName="prose bg-base-200 max-w-none"
            onChange={(mdx) => form.setValue("content", mdx)}
          />
          {errors.content?.message ? (
            <p className="text-error">{errors.content.message}</p>
          ) : null}
        </div>
        <div className="flex-1/3">
          <Input
            label="Title"
            required
            className="input w-full"
            defaultValue={blog.title}
            error={errors.title?.message}
            {...form.register("title")}
          />
          <Input
            label="Slug"
            required
            className="input w-full"
            defaultValue={blog.slug}
            error={errors.slug?.message}
            {...form.register("slug")}
          />
          <Textarea
            label="Summary"
            required
            className="textarea h-24 w-full"
            defaultValue={blog.summary}
            error={errors.summary?.message}
            {...form.register("summary")}
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
