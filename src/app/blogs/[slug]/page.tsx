import { notFound, unauthorized } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import React from "react";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import { getBlogBySlug } from "@/data/blog-dto";
import { canUserEditBlog, canUserSeeBlog } from "@/data/access";
import getUser from "@/lib/getUser";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getUser();
  const blog = await getBlogBySlug(slug);
  if (!blog) return notFound();
  if (!canUserSeeBlog(user, blog)) return unauthorized();

  const code = String(
    await compile(blog.content, {
      format: "md",
      outputFormat: "function-body",
      remarkPlugins: [remarkGfm],
    })
  );

  const { default: MDXContent } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return (
    <>
      {canUserEditBlog(user, blog) ? (
        <div className="float-right">
          <Link className="btn btn-secondary" href={`/blogs/${slug}/edit`}>
            Edit
          </Link>
        </div>
      ) : null}

      <div className="mb-4">
        Published on {blog.createdAt.toLocaleDateString("en-US")}
        {blog.author ? ` by ${blog.author.name}` : ""}
      </div>

      <div className="prose">
        <h1>{blog.title}</h1>
        {blog.coverImage ? (
          <img
            src={blog.coverImage.url}
            alt={blog.coverImage.name}
            style={{ maxHeight: 300 }}
            className="w-full h-96 object-cover rounded-md"
          />
        ) : null}
        <MDXContent components={{}} />
      </div>
    </>
  );
}
