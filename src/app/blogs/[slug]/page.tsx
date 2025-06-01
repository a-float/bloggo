import { notFound } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import React from "react";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import { getBlogBySlug } from "@/data/blog-dto";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();
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
      <div className="float-right">
        <Link className="btn btn-secondary" href={`/blogs/${slug}/edit`}>
          Edit
        </Link>
      </div>

      <span>
        Published on {blog.createdAt.toLocaleDateString("en-US")}
        {blog.author ? ` by ${blog.author.name}` : ""}
      </span>

      <div className="prose">
        <h1>{blog.title}</h1>
        {blog.coverImage ? (
          <img
            src={blog.coverImage.url}
            alt={blog.coverImage.name}
            style={{ maxHeight: 300 }}
            className="w-full h-96 object-cover"
          />
        ) : null}
        <MDXContent components={{}} />
      </div>
    </>
  );
}
