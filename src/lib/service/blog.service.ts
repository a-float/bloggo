import "server-only";
import { getBlogDTO } from "@/data/blog-dto";
import { TagWithCount } from "@/types";
import { Prisma, Role, BlogVisibility, User } from "@prisma/client";
import prisma from "../prisma";

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

export async function getBlogTagCountsForUser(
  user: User | null
): Promise<TagWithCount[]> {
  try {
    const tags: { tag: string; count: bigint }[] = await prisma.$queryRaw(
      Prisma.sql`
    SELECT tag, COUNT(*) as count
    FROM (
      SELECT UNNEST(tags) AS tag FROM blog
      WHERE ${user?.role} = 'ADMIN' OR "visibility" = 'PUBLIC' OR ${user?.id} = "authorId"
    ) as unnested_tags
    GROUP BY tag
    ORDER BY count DESC;
  `
    );
    return tags.map(({ tag, count }) => ({ tag, count: Number(count) }));
  } catch (error) {
    console.error("Error querying blog tag counts:", error);
    return [];
  }
}
