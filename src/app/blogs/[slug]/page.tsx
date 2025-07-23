import React from "react";
import { notFound, unauthorized } from "next/navigation";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
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

  const content = micromark(blog.content, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  });

  return (
    <>
      <div className="self-center w-full flex-1 mt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm flex items-center min-h-10">
            {dayjs(blog.createdAt).format("MMMM D, YYYY")}
            {blog.author ? ` by ${blog.author.name}` : ""}
          </div>
          {canUserEditBlog(user, blog) && (
            <a className="btn btn-ghost" href={`/blogs/${slug}/edit`}>
              Edit
            </a>
          )}
        </div>
        <div className="prose wrap-break-word">
          <h1>{blog.title}</h1>
          {blog.images.length > 0 && (
            <Gallery
              images={blog.images.map((image) => image.url)}
              className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(196px,1fr))] gap-2 md:gap-4 w-full not-prose"
              imageClassName="max-h-[128px] md:max-h-[196px] h-full w-full object-cover rounded-md cursor-pointer hover:scale-102 transition-transform"
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </>
  );
}
