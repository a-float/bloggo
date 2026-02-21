import Image from "next/image";
import { BlogDTO } from "@/data/blog-dto";
import dayjs from "dayjs";
import BadgeRow from "@/components/BadgeRow";
import Avatar from "boring-avatars";
import AvatarWithFallback from "@/components/AvatarWithFallback";

export default function BlogCard({ blog }: { blog: BlogDTO }) {
  return (
    <a className="rounded-(--radius-box)" href={`/blogs/${blog.slug}`}>
      <div className="card card-sm outline-1 outline-base-300 outline-offset-0 h-full bg-base-100 shadow-sm">
        <figure className="relative max-h-70 md:aspect-4/3">
          {blog.coverImage ? (
            <>
              <Image
                className="w-full h-full scale-105 blur-xs opacity-80 absolute object-cover object-center"
                src={blog.coverImage.url}
                width={250}
                height={300}
                alt=""
              />
              <Image
                className="z-0 object-contain w-full h-full object-center"
                width={250}
                height={300}
                src={blog.coverImage.url}
                alt=""
              />
            </>
          ) : (
            <div className="w-full overflow-hidden opacity-80">
              <Avatar
                name={blog.title + blog.author}
                colors={[
                  "var(--color-primary)",
                  "var(--color-base-300)",
                  "var(--color-secondary)",
                ]}
                variant="marble"
                preserveAspectRatio="none"
                square
                size="100%"
              />
            </div>
          )}
        </figure>
        <div className="card-body overflow-hidden">
          <h2 className="card-title">{blog.title}</h2>
          <div className="text-xs whitespace-pre text-base-content/60 flex">
            {dayjs(blog.date ?? blog.createdAt).format("MMMM D, YYYY")}{" "}
            {blog.author?.name ? (
              <span className="flex">
                by{" "}
                <AvatarWithFallback
                  className="w-4 h-4 mr-1"
                  src={blog.author.image}
                  name={blog.author.name}
                />{" "}
                {blog.author.name}
              </span>
            ) : null}
          </div>
          {/* <p className={`line-clamp-3 flex-none`}>{blog.content}</p> */}
          <div className="flex-1" />
          {blog.tags.length > 0 && (
            <BadgeRow tags={blog.tags} className="justify-end align-bottom" />
          )}
        </div>
      </div>
    </a>
  );
}
