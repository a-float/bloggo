import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import React from "react";
import Link from "next/link";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({ where: { slug } });
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
      <div className="prose">
        <h1>{blog.title}</h1>
        <MDXContent components={{}} />
      </div>
    </>
  );
}
