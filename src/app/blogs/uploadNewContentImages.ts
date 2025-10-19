import { BlobManager } from "@/lib/blob/blob-manager";
import { uploadNewImages } from "./uploadNewImages";

export async function uploadNewContentImages(
  content: string,
  blobManager: BlobManager
) {
  const matches = content.matchAll(/blob:http:\/\/[a-zA-Z0-9:\/-]+/g);
  const toUpload: { name: string; url: string }[] = [];
  for (const match of matches) {
    const url = match[0];
    const file = blobManager.getObjectForUrl(url) as File;
    if (!file) continue;
    toUpload.push({
      name: file.name,
      url: url,
    });
  }
  const uploaded = await uploadNewImages(toUpload, blobManager);

  let newContent = content;
  for (let i = 0; i < toUpload.length; i++) {
    newContent = newContent.replaceAll(toUpload[i].url, uploaded[i].url);
  }
  return { content: newContent, images: uploaded };
}
