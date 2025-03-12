import prisma from "@/lib/prisma";
import BlogCard from "./BlogCard";

export default async function Blogs() {
  const blogs = await prisma.blog.findMany();
  return (
    <div>
      <h1 className={"text-3xl mb-4 "}>Blogs below!</h1>
      <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogs.map((blog) => (
          <BlogCard {...blog} key={blog.id} />
        ))}
      </section>
    </div>
  );
}
