import EditBlogForm from "@/app/blogs/EditBlogForm";
import AccessDenied from "@/components/AccessDenied";
import { getServerSession } from "next-auth";

export default async function BlogCreate() {
  const session = await getServerSession();
  if (!session?.user) return <AccessDenied />;

  return <EditBlogForm blog={undefined} />;
}
