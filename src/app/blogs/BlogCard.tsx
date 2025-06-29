import Image from "next/image";
import { BlogDTO } from "@/data/blog-dto";
import dayjs from "dayjs";

export default function BlogCard({ blog }: { blog: BlogDTO }) {
  return (
    <a href={`/blogs/${blog.slug}`}>
      <div className="card card-sm card-side card-border h-full bg-base-100 shadow-lg ">
        {blog.images.length > 0 ? (
          <figure className="flex-[0_0_96px] sm:flex-[0_0_128px]">
            <Image
              className="object-cover w-full"
              width={125}
              height={150}
              src={
                blog.images.at(0)?.url ||
                `https://picsum.photos/seed/${blog.title}/600/300`
              }
              alt=""
            />
          </figure>
        ) : null}
        <div className="card-body">
          <h2 className="card-title">{blog.title}</h2>
          <span className="text-xs whitespace-pre text-base-content/60">
            {dayjs(blog.date ?? blog.createdAt).format("MMMM D, YYYY")}
            {blog.author?.name ? ` by ${blog.author.name}` : null}
          </span>
          <p
            className={`${
              blog.tags.length > 0 ? "line-clamp-1" : "line-clamp-2"
            } flex-none`}
          >
            {blog.content}
          </p>
          {blog.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap justify-end">
              {blog.tags.map((tag) => (
                <div
                  key={tag}
                  className="badge not-hover:badge-ghost badge-sm hover:badge-primary transition-colors"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
