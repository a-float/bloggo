const blobs: Record<string, Blob | null> = {};

function createObjectURL(blob: Blob) {
  const url = URL.createObjectURL(blob);
  blobs[url] = blob;
  return url;
}

function getObjectForUrl(url: string) {
  return blobs[url] ?? null;
}

function revokeObjectUrl(url: string) {
  URL.revokeObjectURL(url);
  if (blobs[url]) delete blobs[url];
}

function getAllBlobs() {
  return blobs;
}

function revokeAllBlobs() {
  for (const url in blobs) {
    revokeObjectUrl(url);
  }
}

const blobManager = {
  createObjectURL,
  getObjectForUrl,
  revokeObjectUrl,
  revokeAllBlobs,
  getAllBlobs,
} as const;

export default blobManager;
