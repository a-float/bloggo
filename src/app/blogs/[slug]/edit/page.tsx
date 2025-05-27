import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditBlogForm from "@/app/blogs/EditBlogForm";
import AccessDenied from "@/components/AccessDenied";
import { getServerSession } from "next-auth";

export default async function BlogEdit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user) return <AccessDenied />;

  const { slug } = await params;
  const blog = await prisma.blog.findFirst({
    where: { slug },
    include: { coverImage: true },
  });
  if (!blog) notFound();
  return <EditBlogForm blog={blog} />;
}
