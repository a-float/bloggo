import Link from "next/link";
import Image from "next/image";
import { BlogDTO } from "@/data/blog-dto";
import dayjs from "dayjs";

export default function BlogCard({ blog }: { blog: BlogDTO }) {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="card card-side card-border h-full bg-base-100 shadow-lg ">
        <figure className="flex-[0_0_96px] md:flex-[0_0_128px]">
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
        <div className="card-body">
          <h2 className="card-title">{blog.title}</h2>
          <span className="text-xs">
            {dayjs(blog.date ?? blog.createdAt).format("MMM D, YYYY")}
            {blog.author?.name ? ` by ${blog.author.name}` : null}
          </span>
          <p className="line-clamp-2 flex-none">{blog.content}</p>
          {blog.tags.length > 0 && (
            <div className="card-actions justify-end">
              {blog.tags.map((tag) => (
                <div key={tag} className="badge badge-outline">
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
