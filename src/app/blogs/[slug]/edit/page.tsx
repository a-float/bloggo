import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

async function updateBlog(blogId: number, formData: FormData) {
  "use server";
  const data = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    summary: formData.get("summary"),
  };

  const errors = [];
  if (!data.title) errors.push({ field: "title", message: "Can't be empty" });
  if (!data.slug) errors.push({ field: "slug", message: "Can't be empty" });
  if (!data.summary)
    errors.push({ field: "summary", message: "Can't be empty" });
  if (!data.content)
    errors.push({ field: "content", message: "Can't be empty" });

  if (errors.length) return;
  //   if (errors.length) return { errors };

  await prisma.blog.update({
    where: { id: blogId },
    data: data as Prisma.BlogUpdateInput,
  });
}

export default async function BlogEdit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({ where: { slug } });
  if (!blog) notFound();
  return (
    <>
      <div className="float-right">
        <Link className="btn btn-secondary" href={`/blogs/${slug}`}>
          View
        </Link>
      </div>
      <form action={updateBlog.bind(null, blog.id)}>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Title</legend>
          <input
            required={true}
            name="title"
            type="text"
            className="input"
            defaultValue={blog.title}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Slug</legend>
          <input
            required={true}
            name="slug"
            type="text"
            className="input"
            defaultValue={blog.slug}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Summary</legend>
          <textarea
            name="summary"
            required={true}
            className="textarea h-24"
            defaultValue={blog.summary}
          ></textarea>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Content</legend>
          <textarea
            name="content"
            required={true}
            className="textarea h-24"
            defaultValue={blog.content}
          ></textarea>
        </fieldset>
        <button className="btn btn-primary">Save</button>
      </form>
    </>
  );
}
