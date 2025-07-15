import { put, del } from "@vercel/blob";
import BlobStorage from "../blob-storage";

export class VercelBlobStorage implements BlobStorage {
  constructor() {
    if (!process.env.BLOB_READ_WRITE_TOKEN)
      throw new Error(
        "process.env.BLOB_READ_WRITE_TOKEN must be defined when using local uploader"
      );
  }
  async upload(file: File): Promise<string> {
    const response = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return response.url;
  }

  async remove(url: string): Promise<void> {
    return await del(url);
  }
}
