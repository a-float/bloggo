import BlogCard from "./BlogCard";
import Link from "next/link";
import { getBlogsForUser } from "@/lib/service/blog.service";
import getUser from "@/lib/getUser";
import { canUserCreateBlog } from "@/data/access";

export default async function Blogs() {
  const user = await getUser();
  const blogs = await getBlogsForUser(user);
  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl">Blogs</h1>
        {canUserCreateBlog(user) ? (
          <Link href="/blogs/create" className="btn btn-primary ">
            Create new blog
          </Link>
        ) : null}
      </div>
      <section className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard blog={blog} key={blog.id} />
        ))}
      </section>
    </div>
  );
}
