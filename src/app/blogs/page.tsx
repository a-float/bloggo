import { Suspense } from "react";
import { TbInfoCircle } from "react-icons/tb";
import { canUserCreateBlog } from "@/data/access";
import { getBlogsForUser } from "@/lib/service/blog.service";
import { getSession } from "@/lib/session";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import Modal from "@/components/Modal";
import { useState } from "react";
import { createOrUpdateBlog } from "@/actions/edit-create-blog.action";
import { BlogVisibility } from "@prisma/client";
import toast from "react-hot-toast";

export default async function Blogs({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const { user } = await getSession();
  const { search, sort } = await searchParams;
  const blogs = await getBlogsForUser(user, {
    search,
    sort: sort === "date" ? "date" : "createdAt",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }
    // Generate a unique title: "Quick Post - timestamp - random string"
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const title = `Quick Post - ${timestamp}-${random}`;
    try {
      await createOrUpdateBlog({
        title,
        content,
        tags: [],
        date: null,
        visibility: BlogVisibility.FRIENDS, // default to friends-only for quick posts
      });
      toast.success("Quick post created!");
      setIsModalOpen(false);
      setContent("");
      // Optionally, we could refetch blogs, but the page is revalidated every 60 seconds.
      // For immediate update, we could refetch, but let's keep it simple.
    } catch (error) {
      toast.error(`Failed to create post: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl">Blogs</h1>
        <div className="flex gap-2">
          {canUserCreateBlog(user) ? (
            <>
              <a href="/blogs/create" className="btn btn-soft">
                Create new blog
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-soft btn-primary"
              >
                Quick post
              </button>
            </>
          ) : null}
        </div>
      </div>
      <Suspense>
        <SearchBar />
      </Suspense>
      {blogs.length === 0 ? (
        <div role="alert" className="alert alert-vertical sm:alert-horizontal">
          <TbInfoCircle className="text-info" size={24} />
          <div>
            <h3 className="font-bold">Oof, looks pretty empty.</h3>
            <div className="text-xs">
              Log in and add friends to see their blogs, or create your own to
              get started!
            </div>
          </div>
        </div>
      ) : (
        <section className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
          {blogs.map((blog) => (
            <BlogCard blog={blog} key={blog.id} />
          ))}
        </section>
      )}
      {/* Quick Post Modal */}
      <Modal id="quick-post-modal" open={isModalOpen}>
        <div className="modal-box">
          <h3 className="font-bold text-xl">Quick Post</h3>
          <p className="py-4">Share a quick thought or update.</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="textarea w-full h-24 mb-4"
          />
          <div className="modal-action">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Post
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
