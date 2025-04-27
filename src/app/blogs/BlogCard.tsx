import Link from "next/link";
import Image from "next/image";
import { BlogWithCoverImage } from "@/types";

export default function BlogCard({ blog }: { blog: BlogWithCoverImage }) {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="card h-full bg-base-100 shadow-lg">
        <figure>
          <Image
            className="w-full object-cover"
            width={600}
            height={300}
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
            {/* <div className="badge badge-secondary">NEW</div> */}
          </h2>
          {new Date(blog.date ?? blog.createdAt).toDateString()}
          {!!blog.summary && <p>{blog.summary}</p>}
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
