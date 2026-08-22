import crypto from "crypto";
import type { IImageRepository } from "../../../domain/repositories/IImageRepository.js";
import type { IFileStorage, UploadedFile } from "../../interfaces/IFileStorage.js";
import type { Image } from "../../../domain/entities/Image.js";
import { AppError } from "../../../common/errors/AppError.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class UpdateImageUseCase {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(
    id: string,
    userId: string,
    title?: string,
    file?: UploadedFile,
  ): Promise<Image> {
    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new AppError("Image not found", StatusCodes.NOT_FOUND);
    }
    if (image.userId !== userId) {
      throw new AppError("Access denied to this image", StatusCodes.FORBIDDEN);
    }

    if (title !== undefined) {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        throw new AppError("Image title cannot be empty", StatusCodes.BAD_REQUEST);
      }
      image.title = trimmedTitle;
    }

    let oldKey: string | null = null;

    if (file) {
      const fileExtension = file.originalname.split(".").pop();
      const uniqueName = `${crypto.randomUUID()}.${fileExtension}`;
      const newKey = `uploads/${userId}/${uniqueName}`;

      try {
        await this.fileStorage.upload(file, newKey);
        oldKey = image.key;
        image.key = newKey;
      } catch (err) {
        throw new AppError("Failed to upload new image file to S3", StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }

    try {
      const updatedImage = await this.imageRepository.update(image);

      if (oldKey) {
        try {
          await this.fileStorage.delete(oldKey);
        } catch (err) {
          console.warn(`[WARN] Failed to delete old S3 object: ${oldKey}`, err);
        }
      }

      updatedImage.url = await this.fileStorage.getPresignedUrl(updatedImage.key, 3600);
      return updatedImage;
    } catch (err) {
      if (file && image.key !== oldKey && oldKey !== null) {
        try {
          await this.fileStorage.delete(image.key);
        } catch (s3Err) {
          console.warn(`[WARN] Cleanup failed for newly uploaded S3 object: ${image.key}`, s3Err);
        }
      }
      throw err;
    }
  }
}
