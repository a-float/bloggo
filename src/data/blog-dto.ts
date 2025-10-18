import { Prisma } from "@prisma/client";
import { getUserDTO } from "./user-dto.ts";

// TODO do not always query for images?
type FullBlog = Prisma.BlogGetPayload<{
  include: { coverImage: true; images: true; author: true };
}>;

export function getBlogDTO(blog: FullBlog) {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    content: blog.content,
    date: blog.date,
    tags: blog.tags,
    visibility: blog.visibility,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    coverImage: blog.coverImage,
    images: blog.images.map((image) => ({
      id: image.id,
      url: image.url,
      name: image.name,
    })),
    author: blog.author ? getUserDTO(blog.author) : null,
  };
}

export type BlogDTO = Awaited<ReturnType<typeof getBlogDTO>>;
