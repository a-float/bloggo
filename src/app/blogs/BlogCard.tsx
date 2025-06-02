import Link from "next/link";
import Image from "next/image";
import { BlogDTO } from "@/data/blog-dto";

export default function BlogCard({ blog }: { blog: BlogDTO }) {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="card h-full bg-base-100 shadow-lg">
        <figure>
          <Image
            className="w-full object-cover h-36"
            width={400}
            height={200}
            src={
              blog.coverImage
                ? blog.coverImage.url
                : `https://picsum.photos/seed/${blog.title}/600/300`
            }
            alt=""
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {blog.title}
          </h2>
          <span>
            {new Date(blog.date ?? blog.createdAt).toDateString()}
            {blog.author?.name ? ` by ${blog.author.name}` : null}
          </span>
          <p className="line-clamp-2">{blog.content.slice(0, 256)}</p>
          <div className="card-actions justify-end">
            {blog.tags.map((tag) => (
              <div key={tag} className="badge badge-outline">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
