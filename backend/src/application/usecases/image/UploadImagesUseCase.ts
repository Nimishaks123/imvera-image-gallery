import crypto from "crypto";
import type { IImageRepository } from "../../../domain/repositories/IImageRepository.js";
import type { IFileStorage, UploadedFile } from "../../interfaces/IFileStorage.js";
import type { IUploadImagesUseCase } from "../../interfaces/IUploadImagesUseCase.js";
import type { Image } from "../../../domain/entities/Image.js";
import { AppError } from "../../../common/errors/AppError.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";
import type { ILogger } from "../../interfaces/ILogger.js";

export class UploadImagesUseCase implements IUploadImagesUseCase {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly fileStorage: IFileStorage,
    private readonly logger: ILogger,
  ) {}

  async execute(
    userId: string,
    files: UploadedFile[],
    titles: string[],
  ): Promise<Image[]> {
    if (files.length === 0) {
      throw new AppError("No files provided", StatusCodes.BAD_REQUEST);
    }

    if (files.length !== titles.length) {
      throw new AppError(
        "The number of titles must match the number of files",
        StatusCodes.BAD_REQUEST,
      );
    }

    const createdImages: Image[] = [];
    const maxOrder = await this.imageRepository.getMaxOrder(userId);
    const startOrder = maxOrder !== -1 ? maxOrder + 1 : 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      const title = titles[i]!.trim();

      if (!title) {
        throw new AppError("Image title is required", StatusCodes.BAD_REQUEST);
      }

      const fileExtension = file.originalname.split(".").pop();
      const uniqueName = `${crypto.randomUUID()}.${fileExtension}`;
      const key = `uploads/${userId}/${uniqueName}`;

      let uploadedKey: string;

      try {
        uploadedKey = await this.fileStorage.upload(file, key);
      } catch (err: unknown) {
        this.logger.error("Failed to upload image to S3 storage", err);

        throw new AppError(
          "Failed to upload image to S3 storage",
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      try {
        const image = await this.imageRepository.create({
          userId,
          title,
          key: uploadedKey,
          order: startOrder + i,
        });

        image.url = await this.fileStorage.getPresignedUrl(image.key, 3600);
        createdImages.push(image);
      } catch (err: unknown) {
        this.logger.error(
          "Failed to create image record. Cleaning up uploaded S3 object.",
          {
            uploadedKey,
            error: err,
          },
        );

        try {
          await this.fileStorage.delete(uploadedKey);
        } catch (cleanupError: unknown) {
          this.logger.warn("Failed to clean up uploaded S3 object", {
            uploadedKey,
            error: cleanupError,
          });
        }

        throw err;
      }
    }

    return createdImages;
  }
}