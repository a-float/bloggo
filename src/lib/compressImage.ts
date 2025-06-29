import imageCompression, { type Options } from "browser-image-compression";

const options: Options = {
  maxSizeMB: 0.25,
  // maxWidthOrHeight: 1024,
  useWebWorker: true,
};

export async function compressImage(imageFile: File) {
  const blob = (await imageCompression(imageFile, options)) as Blob;
  const compressedImage = new File([blob], imageFile.name);

  return compressedImage;
}
