import { uploadFiles } from "@/actions/upload-files.action";
import { BlobManager } from "@/lib/blobManager";
import { compressImage } from "@/lib/compressImage";

const MAX_REQUEST_SIZE = 1 * 1024 * 1024; // 1MB

export async function uploadNewImages(
  images: { name: string; url: string }[],
  blobManager: BlobManager
) {
  const uploaded: Awaited<ReturnType<typeof uploadFiles>> = [];
  let formData = new FormData();
  let runningSize = 0;

  const uploadBatch = async () => {
    if (runningSize === 0) return;
    uploaded.push(...(await uploadFiles(formData)));
    formData = new FormData();
    runningSize = 0;
  };

  const compressedImages = await Promise.all(
    images.flatMap((image) => {
      const file = blobManager.getObjectForUrl(image.url);
      if (!file) return [];
      return compressImage(file as File);
    })
  );

  for (const compressedImage of compressedImages) {
    if (runningSize + compressedImage.size > MAX_REQUEST_SIZE) {
      await uploadBatch();
    }
    runningSize += compressedImage.size;
    formData.append("file", compressedImage);
  }
  await uploadBatch();

  let i = 0;
  return images.map((image, idx) => ({
    order: idx,
    name: image.name,
    url: blobManager.getObjectForUrl(image.url) ? uploaded[i++].url : image.url,
  }));
}
