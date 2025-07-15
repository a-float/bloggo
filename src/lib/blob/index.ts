import { LocalBlobStorage } from "./uploader/local-blob.storage";
import { VercelBlobStorage } from "./uploader/vercel-blob.storage";

export function createBlobStorage() {
  if (process.env.NODE_ENV === "development") return new LocalBlobStorage();
  return new VercelBlobStorage();
}
