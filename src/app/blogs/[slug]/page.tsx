import { notFound, unauthorized } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import React from "react";
import remarkGfm from "remark-gfm";
import { getBlogBySlug } from "@/lib/service/blog.service";
import { canUserEditBlog, canUserSeeBlog } from "@/data/access";
import { getSession } from "@/lib/session";
import Gallery from "@/components/Gallery";
import dayjs from "dayjs";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { user } = await getSession();
  const blog = await getBlogBySlug(slug);
  if (!blog) return notFound();
  const canSeeBlog = await canUserSeeBlog(user, blog);
  if (!canSeeBlog) return unauthorized();

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
      <div className="self-center prose w-full max-w-[80ch] flex-1 mt-4">
        <div className="flex justify-between">
          <h1>{blog.title}</h1>
          <div className="flex-1" />
          {canUserEditBlog(user, blog) && (
            <a className="btn btn-ghost" href={`/blogs/${slug}/edit`}>
              Edit
            </a>
          )}
        </div>
        <div className="text-sm -mt-4">
          {dayjs(blog.createdAt).format("MMMM D, YYYY")}
          {blog.author ? ` by ${blog.author.name}` : ""}
        </div>
        <div className="divider" />
        {blog.images.length > 0 && (
          <Gallery
            images={blog.images.map((image) => image.url)}
            className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(196px,1fr))] gap-2 md:gap-4 w-full not-prose"
            imageClassName="max-h-[128px] md:max-h-[196px] h-full w-full object-cover rounded-md cursor-pointer hover:scale-102 transition-transform"
          />
        )}

        <MDXContent components={{}} />
      </div>
    </>
  );
}
