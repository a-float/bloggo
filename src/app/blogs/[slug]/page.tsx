import React from "react";
import { notFound, unauthorized } from "next/navigation";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { getBlogBySlug } from "@/lib/service/blog.service";
import { canUserEditBlog, canUserSeeBlog } from "@/data/access";
import { getSession } from "@/lib/session";
import Gallery from "@/components/Gallery";
import dayjs from "dayjs";
import AvatarWithFallback from "@/components/AvatarWithFallback";

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
        <div className="flex justify-between">
          <div className="prose mb-6">
            <h1>{blog.title}</h1>
          </div>
          <div className="flex-1"></div>
          {canUserEditBlog(user, blog) && (
            <a className="btn btn-ghost" href={`/blogs/${slug}/edit`}>
              Edit
            </a>
          )}
        </div>
        {/* TODO extract to another component */}
        <div className="text-sm flex items-center">
          {blog.author ? (
            <>
              <div className="size-7 rounded-full overflow-hidden mr-2">
                <AvatarWithFallback
                  src={blog.author.image}
                  name={blog.author.email ?? "anon"}
                />
              </div>
              {blog.author.name ?? "anonymous"} on
            </>
          ) : null}{" "}
          {dayjs(blog.createdAt).format("MMMM D, YYYY")}
        </div>
        <div className="divider" />
        {blog.images.length > 0 && (
          <Gallery
            images={blog.images.map((image) => image.url)}
            className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(196px,1fr))] gap-2 md:gap-4 w-full not-prose"
            imageClassName="max-h-[128px] md:max-h-[196px] h-full w-full object-cover rounded-md cursor-pointer hover:scale-102 transition-transform"
          />
        )}
        <div
          className="prose"
          style={{ wordWrap: "break-word" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </>
  );
}
