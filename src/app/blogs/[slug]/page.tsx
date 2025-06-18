import { notFound, unauthorized } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import React from "react";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import { getBlogBySlug } from "@/lib/service/blog.service";
import { canUserEditBlog, canUserSeeBlog } from "@/data/access";
import getUser from "@/lib/getUser";
import Gallery from "@/components/Gallery";

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

      <div className="mx-auto prose max-w-[80ch]">
        <div className="mb-4">
          Published on {blog.createdAt.toLocaleDateString("en-US")}
          {blog.author ? ` by ${blog.author.name}` : ""}
        </div>

        <h1>{blog.title}</h1>
        <Gallery
          images={blog.images.map((image) => image.url)}
          className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(196px,1fr))] gap-2 md:gap-4 w-full not-prose"
          imageClassName="max-h-[128px] md:max-h-[196px] h-full w-full object-cover rounded-md cursor-pointer hover:scale-102 transition-transform"
        />

        <MDXContent components={{}} />
      </div>
    </>
  );
}
