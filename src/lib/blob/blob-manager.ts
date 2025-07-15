export class BlobManager {
  blobs: Record<string, Blob | null> = {};

  createObjectURL(blob: Blob) {
    const url = URL.createObjectURL(blob);
    this.blobs[url] = blob;
    return url;
  }

  getObjectForUrl(url: string) {
    return this.blobs[url] ?? null;
  }

  revokeObjectUrl(url: string) {
    URL.revokeObjectURL(url);
    if (this.blobs[url]) delete this.blobs[url];
  }

  getAllBlobs() {
    return this.blobs;
  }

  revokeAllBlobs() {
    for (const url in this.blobs) {
      this.revokeObjectUrl(url);
    }
  }
}
