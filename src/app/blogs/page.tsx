import prisma from "@/lib/prisma";

export default async function Blogs() {
  const blogs = await prisma.blog.findMany();
  return (
    <div>
      <h1 className="text-xl text-red-500">Superblog</h1>
      <ol>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <h2 className="text-sm text-blue-500">{blog.title}</h2>
            <p>{blog.content}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
