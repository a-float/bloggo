import prisma from "@/lib/prisma";
import BlogCard from "./BlogCard";
import Link from "next/link";

export default async function Blogs() {
  const blogs = await prisma.blog.findMany({ include: { coverImage: true } });
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className={"text-3xl  "}>Blogs below!</h1>
        <Link href="/blogs/create" className="btn btn-primary">
          Create new blog
        </Link>
      </div>
      <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogs.map((blog) => (
          <BlogCard blog={blog} key={blog.id} />
        ))}
      </section>
    </div>
  );
}
