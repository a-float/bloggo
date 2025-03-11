import prisma from "@/lib/prisma";
import BlogCard from "./BlogCard";

export default async function Blogs() {
  const blogs = await prisma.blog.findMany();
  return (
    <div>
      <h1 className="text-3xl mb-4">My Blog</h1>
      <section className="grid grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <BlogCard {...blog} key={blog.id} />
        ))}
      </section>
    </div>
  );
}
