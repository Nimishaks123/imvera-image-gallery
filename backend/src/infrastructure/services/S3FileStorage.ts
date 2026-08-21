import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { IFileStorage, UploadedFile } from "../../application/interfaces/IFileStorage.js";

interface S3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

export class S3FileStorage implements IFileStorage {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: S3Config) {
    const { region, accessKeyId, secretAccessKey, bucket } = config;

    if (!region || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error(
        "Incomplete AWS S3 configuration. Ensure AWS_REGION, AWS_ACCESS_KEY_ID, " +
          "AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET are set in your environment.",
      );
    }

    this.client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    this.bucket = bucket;
  }

  async upload(file: UploadedFile, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
    });
    await this.client.send(command);
    return key;
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    await this.client.send(command);
  }

  async getPresignedUrl(key: string, expiresInSeconds: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }
}
