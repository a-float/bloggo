import "server-only";
import prisma from "@/lib/prisma";
import { BlogVisibility, Prisma, Role, User } from "@prisma/client";
import { getUserDTO } from "./user-dto.ts";
import { TagWithCount } from "@/types.js";

type FullBlog = Prisma.BlogGetPayload<{
  include: { images: true; author: true };
}>;

export async function getBlogById(id: number) {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { images: true, author: true },
  });
  return blog ? getBlogDTO(blog) : null;
}

export async function getBlogBySlug(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { images: true, author: true },
  });
  return blog ? getBlogDTO(blog) : null;
}

function getBlogWhereForUser(user: User | null): Prisma.BlogWhereInput {
  if (user?.role === Role.ADMIN) return {};
  if (!user) return { visibility: BlogVisibility.PUBLIC };
  return { OR: [{ authorId: user.id }, { visibility: BlogVisibility.PUBLIC }] };
}

export async function getBlogsForUser(user: User | null) {
  const blogs = await prisma.blog.findMany({
    where: getBlogWhereForUser(user),
    include: { images: true, author: true },
    orderBy: { createdAt: "desc" },
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
    visibility: blog.visibility,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    images: blog.images.map((image) => ({
      url: image.url,
      name: image.name,
    })),
    author: blog.author ? getUserDTO(blog.author) : null,
  };
}

export async function getBlogTagCountsForUser(
  user: User | null
): Promise<TagWithCount[]> {
  const tags: { tag: string; count: bigint }[] = await prisma.$queryRaw(
    Prisma.sql`
    SELECT tag, COUNT(*) as count
    FROM (
      SELECT UNNEST(tags) AS tag FROM blog
      WHERE ${user?.role} = 'ADMIN' OR "visibility" = 'PUBLIC' OR ${user?.id} = "authorId"
    )
    GROUP BY tag
    ORDER BY count DESC;
  `
  );
  return tags.map(({ tag, count }) => ({ tag, count: Number(count) }));
}

export type BlogDTO = Awaited<ReturnType<typeof getBlogDTO>>;
