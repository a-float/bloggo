import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditBlogForm from "@/app/blogs/EditBlogForm";

export default async function BlogEdit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({
    where: { slug },
    include: { coverImage: true },
  });
  if (!blog) notFound();
  return <EditBlogForm blog={blog} />;
}
