"use client";

import React from "react";
import { FaXmark } from "react-icons/fa6";
import { BlobManager } from "@/lib/blob/blob-manager";
import toast from "react-hot-toast";
import { Input } from "@/components/form/TextInput";
import FileInput from "@/components/form/FileInput";

type ImageInsertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (src: string, alt?: string) => void;
};

export default function ImageInsertModal({
  isOpen,
  onClose,
  onInsert,
}: ImageInsertModalProps) {
  const [imageUrl, setImageUrl] = React.useState("");
  const [altText, setAltText] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"upload" | "link">("upload");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleInsert = () => {
    if (activeTab === "upload" && fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      const blobUrl = BlobManager.getInstance().createObjectURL(file);
      onInsert(blobUrl, altText || file.name);
    } else if (activeTab === "link" && imageUrl.trim()) {
      onInsert(imageUrl.trim(), altText);
    } else {
      toast.error("Please provide a valid image.");
      return;
    }
    onClose();
  };

  const resetModal = () => {
    setImageUrl("");
    setAltText("");
  };

  React.useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="fixed inset-0 bg-black opacity-75" onClick={onClose} />

      <div className="flex flex-col gap-2 px-6 py-4 relative bg-base-100 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Insert Image</h3>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost btn-circle"
          >
            <FaXmark />
          </button>
        </div>

        <div>
          <div className="tabs tabs-box tabs-sm">
            <a
              className={`tab ${activeTab === "upload" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload
            </a>
            <a
              className={`tab ${activeTab === "link" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("link")}
            >
              Link
            </a>
          </div>
          {activeTab === "upload" ? (
            <FileInput
              aria-required
              label={"Upload image"}
              ref={fileInputRef}
              accept="image/*"
            />
          ) : (
            <Input
              aria-required
              label={"Image URL"}
              onChange={(e) => setImageUrl(e.target.value)}
              type="url"
              className="input input-bordered w-full"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
            />
          )}
          <Input
            label="Alt text"
            aria-required
            type="text"
            className="input input-bordered w-full"
            placeholder="Describe the image..."
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="btn btn-primary"
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
}
