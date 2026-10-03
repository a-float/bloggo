import { useState } from "react";
import { createOrUpdateBlog } from "@/actions/edit-create-blog.action";
import { BlogVisibility } from "@prisma/client";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";

export default function QuickPostButton({ user }: { user: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }
    try {
      await createOrUpdateBlog({
        title: title.trim(),
        content: content.trim(),
        tags: [],
        date: date ? new Date(date) : null,
        visibility: BlogVisibility.FRIENDS, // default to friends-only for quick posts
      });
      toast.success("Quick post created!");
      setIsModalOpen(false);
      setTitle("");
      setDate("");
      setContent("");
    } catch (error) {
      toast.error(`Failed to create post: ${error.message}`);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-soft btn-primary"
      >
        Quick post
      </button>
      {/* Quick Post Modal */}
      <Modal id="quick-post-modal" open={isModalOpen}>
        <div className="modal-box">
          <h3 className="font-bold text-xl">Quick Post</h3>
          <p className="py-4">Share a quick thought or update.</p>
          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="input input-bordered w-full"
            />
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="input input-bordered w-full"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="textarea w-full h-24 mb-4"
            />
          </div>
          <div className="modal-action">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn btn-primary">
              Post
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}