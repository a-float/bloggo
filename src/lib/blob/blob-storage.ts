export default interface BlobStorage {
  upload(file: File): Promise<string>;
  remove(url: string): Promise<void>;
  removeMany(urls: string[]): Promise<void>;
}
