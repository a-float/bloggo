import { LegendLabel } from "@/components/form/common";
import { BlobManager } from "@/lib/blob/blob-manager";
import { FaXmark } from "react-icons/fa6";
import { ItemInterface, ReactSortable } from "react-sortablejs";

export type SortableImage = ItemInterface & { name: string; url: string };

export default function SortableImageInput({
  images,
  setImages,
  blobManagerRef,
}: {
  images: SortableImage[];
  setImages: (images: SortableImage[]) => void;
  blobManagerRef: React.RefObject<BlobManager>;
}) {
  return (
    <fieldset className="fieldset">
      <LegendLabel>Gallery images</LegendLabel>
      <span className="text-base-content/75">
        These images will be shown in a gallery at the end of the blog post.
      </span>
      <input
        type="file"
        className="file-input w-full"
        key={images.length}
        name="imageFiles"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (!files.length) return;
          const newFiles = files.map((file) => {
            const url = blobManagerRef.current.createObjectURL(file);
            return { name: file.name, url, id: url };
          });
          setImages([...newFiles, ...images]);
        }}
      />
      <ReactSortable list={images} setList={setImages}>
        {images.map((item) => (
          <div key={item.id}>
            <div className="flex items-center gap-2 cursor-grab hover:bg-base-200 p-1 px-2">
              <img
                className="h-[36px] w-[36px] text-info rounded-sm object-cover"
                alt=""
                src={item.url}
              />
              <span>{item.name}</span>
              <div className="flex-1" />
              <button
                className="btn btn-xs btn-soft btn-error btn-square"
                onClick={() =>
                  setImages(images.filter((x) => x.url !== item.url))
                }
              >
                <FaXmark />
                <span className="sr-only">Remove image</span>
              </button>
            </div>
          </div>
        ))}
      </ReactSortable>
    </fieldset>
  );
}
