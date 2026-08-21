export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface IFileStorage {
  upload(file: UploadedFile, key: string): Promise<string>;
  delete(key: string): Promise<void>;
  getPresignedUrl(key: string, expiresInSeconds: number): Promise<string>;
}
