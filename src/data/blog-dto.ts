import "server-only";
import prisma from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { getUserDTO } from "./user-dto.ts";

type FullBlog = Prisma.BlogGetPayload<{
  include: { coverImage: true; author: true };
}>;

export async function getBlogById(id: number) {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { coverImage: true, author: true },
  });
  return blog ? getBlogDTO(blog) : null;
}

export async function getBlogBySlug(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { coverImage: true, author: true },
  });
  return blog ? getBlogDTO(blog) : null;
}

function getBlogWhereForUser(user: User | null): Prisma.BlogWhereInput {
  if (user?.isAdmin) return {};
  if (!user) return { isPublic: true };
  return { OR: [{ authorId: user.id }, { isPublic: true }] };
}

export async function getBlogsForUser(user: User | null) {
  const blogs = await prisma.blog.findMany({
    where: getBlogWhereForUser(user),
    include: { coverImage: true, author: true },
  });
  return blogs.map((blog) => getBlogDTO(blog));
}

export function getBlogDTO(blog: FullBlog) {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    content: blog.content,
    date: blog.date,
    tags: blog.tags,
    isPublic: blog.isPublic,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    coverImage: blog.coverImage
      ? {
          url: blog.coverImage.url,
          name: blog.coverImage.name,
        }
      : null,
    author: blog.author ? getUserDTO(blog.author) : null,
  };
}


export type BlogDTO = Awaited<ReturnType<typeof getBlogDTO>>;
