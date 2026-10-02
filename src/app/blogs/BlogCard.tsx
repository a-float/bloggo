import Avatar from "boring-avatars";
import dayjs from "dayjs";
import AvatarWithFallback from "@/components/AvatarWithFallback";
import BadgeRow from "@/components/BadgeRow";
import BlurredBackgroundImage from "@/components/BlurredBackgroundImage";
import type { BlogDTO } from "@/data/blog-dto";

const getContentPreview = (content: string): string => {
  if (!content) return "";
  // If content is short, show it all; otherwise, show first 100 characters and add ellipsis
  if (content.length <= 100) {
    return content;
  }
  return content.slice(0, 100) + "...";
};

export default function BlogCard({ blog }: { blog: BlogDTO }) {
  return (
    <a className="rounded-(--radius-box)" href={`/blogs/${blog.slug}`}>
      <div className="card card-sm outline-1 outline-base-300 outline-offset-0 h-full bg-base-100 shadow-sm">
        <figure className="relative max-h-70 md:aspect-video">
          {blog.coverImage ? (
            <BlurredBackgroundImage
              src={blog.coverImage.url}
              alt={blog.title}
            />
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
          <p className="line-clamp-2 flex-none text-base-content/60 mb-2">
            {getContentPreview(blog.content)}
          </p>
          <div className="text-xs whitespace-pre text-base-content/60 flex">
            {blog.date ? dayjs(blog.date).format("MMMM D, YYYY") : null}{" "}
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
          <div className="flex-1" />
          {blog.tags.length > 0 && (
            <BadgeRow tags={blog.tags} className="justify-end align-bottom" />
          )}
        </div>
      </div>
    </a>
  );
}
