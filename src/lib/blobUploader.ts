import fs from "fs/promises";
import path from "path";
import { put, del } from "@vercel/blob";

interface FileUploader {
  upload(file: File): Promise<string>;
  remove(url: string): Promise<void>;
}

export function getFileUploader() {
  if (process.env.NODE_ENV === "development") return new LocalFileUploader();
  return new VercelFileUploader();
}

export class VercelFileUploader implements FileUploader {
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

export class LocalFileUploader implements FileUploader {
  constructor() {
    if (!process.env.LOCAL_STORAGE_PATH)
      throw new Error(
        "process.env.LOCAL_STORAGE_PATH must be defined when using local uploader"
      );
  }

  private getTimestamp() {
    const rng = Math.floor(Math.random() * 8999) + 1000;
    return new Date().toISOString().replace(/[-:.]/g, "_") + "_" + rng;
  }

  async upload(file: File): Promise<string> {
    const fileName = this.getTimestamp() + "_" + file.name;
    const fileDir = path.join(process.cwd(), process.env.LOCAL_STORAGE_PATH!);
    const filePath = path.join(fileDir, fileName);
    await fs.mkdir(fileDir, { recursive: true });
    await fs.writeFile(filePath, await file.bytes());
    return filePath.replace(process.cwd() + "/public", "");
  }

  async remove(url: string): Promise<void> {
    if (url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg")) {
      const fullUrl = path.join(process.cwd(), "public", url);
      await fs.unlink(fullUrl);
    } else {
      console.warn("Removing local files other than images is not supported");
    }
  }
}
