"use client";

import { Blog } from "@prisma/client";
import { updateBlog } from "./update-blog.action";
import React from "react";
import Link from "next/link";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import { useForm } from "react-hook-form";
import { ForwardRefMDXEditor } from "@/components/ForwardRefMDXEditor";
import { Input, Textarea } from "@/components/Input";
import toast from "react-hot-toast";

type Inputs = Parameters<typeof updateBlog>[2];

export default function EditBlogForm({ blog }: { blog: Blog }) {
  const editorRef = React.useRef<MDXEditorMethods | null>(null);
  const [state, formAction, isPending] = React.useActionState<
    ReturnType<typeof updateBlog>,
    Inputs
  >((state, data) => updateBlog(state, blog.id, data), { errors: [] });

  const form = useForm<Inputs>({ defaultValues: blog });

  const onSubmit = (data: Inputs) =>
    React.startTransition(() => formAction(data));

  React.useEffect(() => {
    if (state.success) {
      toast.success("Blog updated successfully");
    } else {
      state.errors.forEach((e) => {
        if (e.field) form.setError(e.field, { message: e.message });
        else toast.error(e.message);
      });
    }
  }, [state, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-row gap-8">
        <div className="mt-4 flex-2/3">
          <ForwardRefMDXEditor
            ref={editorRef}
            markdown={blog.content}
            contentEditableClassName="prose bg-base-200 max-w-none"
            onChange={(mdx) => form.setValue("content", mdx)}
          />
        </div>
        <div className="flex-1/3">
          <Input
            label="Title"
            required
            className="input w-full"
            defaultValue={blog.title}
            error={form.formState.errors.title?.message}
            {...form.register("title")}
          />
          <Input
            label="Slug"
            required
            className="input w-full"
            defaultValue={blog.slug}
            error={form.formState.errors.slug?.message}
            {...form.register("slug")}
          />
          <Textarea
            label="Summary"
            required
            className="textarea h-24 w-full"
            defaultValue={blog.summary}
            error={form.formState.errors.summary?.message}
            {...form.register("summary")}
          />

          <div className="flex gap-4 mt-4">
            <Link className="btn btn-secondary" href={`/blogs/${blog.slug}`}>
              Cancel
            </Link>
            <button disabled={isPending} className="btn btn-primary">
              {isPending ? (
                <span className="loading loading-spinner" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
