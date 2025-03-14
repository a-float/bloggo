import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditBlogForm from "./client";

export default async function BlogEdit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({ where: { slug } });
  if (!blog) notFound();
  return <EditBlogForm blog={blog} />;
}
