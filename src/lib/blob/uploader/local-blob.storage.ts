import fs from "fs/promises";
import path from "path";
import BlobStorage from "../blob-storage";

export class LocalBlobStorage implements BlobStorage {
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
