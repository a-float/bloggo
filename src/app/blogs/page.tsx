import BlogCard from "./BlogCard";
import { getBlogsForUser } from "@/lib/service/blog.service";
import { getSession } from "@/lib/session";
import { canUserCreateBlog } from "@/data/access";
import { TbInfoCircle } from "react-icons/tb";

export default async function Blogs() {
  const { user } = await getSession();
  const blogs = await getBlogsForUser(user);
  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl">Blogs</h1>
        {canUserCreateBlog(user) ? (
          <a href="/blogs/create" className="btn btn-outline">
            Create new blog
          </a>
        ) : null}
      </div>
      {blogs.length === 0 ? (
        <>
          <div
            role="alert"
            className="alert alert-vertical sm:alert-horizontal"
          >
            <TbInfoCircle className="text-info" size={24} />
            <div>
              <h3 className="font-bold">Oof, looks pretty empty.</h3>
              <div className="text-sm">
                Log in and add friends to see their blogs, or create your own to
                get started!
              </div>
            </div>
          </div>
        </>
      ) : (
        <section className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
          {blogs.map((blog) => (
            <BlogCard blog={blog} key={blog.id} />
          ))}
        </section>
      )}
    </div>
  );
}
