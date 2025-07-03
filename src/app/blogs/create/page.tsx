import EditBlogForm from "@/app/blogs/EditBlogForm";
import { canUserCreateBlog } from "@/data/access";
import { getBlogTagCountsForUser } from "@/lib/service/blog.service";
import { getSession } from "@/lib/session";
import { unauthorized } from "next/navigation";

export default async function BlogCreate() {
  const { user } = await getSession();
  if (!canUserCreateBlog(user)) return unauthorized();
  const tagCounts = await getBlogTagCountsForUser(user);
  return <EditBlogForm blog={undefined} tagCounts={tagCounts} />;
}
