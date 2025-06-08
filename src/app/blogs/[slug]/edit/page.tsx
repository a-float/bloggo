import { notFound, unauthorized } from "next/navigation";
import EditBlogForm from "@/app/blogs/EditBlogForm";
import getUser from "@/lib/getUser";
import { getBlogBySlug, getBlogTagCountsForUser } from "@/data/blog-dto";
import { canUserEditBlog } from "@/data/access";

export default async function BlogEdit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getUser();
  if (!user) return unauthorized();
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();
  if (!canUserEditBlog(user, blog)) return unauthorized();
  const tagCounts = await getBlogTagCountsForUser(user);
  return <EditBlogForm blog={blog} tagCounts={tagCounts} />;
}
