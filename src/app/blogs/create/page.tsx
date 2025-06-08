import EditBlogForm from "@/app/blogs/EditBlogForm";
import { canUserCreateBlog } from "@/data/access";
import { getBlogTagCountsForUser } from "@/data/blog-dto";
import getUser from "@/lib/getUser";
import { unauthorized } from "next/navigation";

export default async function BlogCreate() {
  const user = await getUser();
  if (!canUserCreateBlog(user)) return unauthorized();
  const tagCounts = await getBlogTagCountsForUser(user);
  return <EditBlogForm blog={undefined} tagCounts={tagCounts} />;
}
