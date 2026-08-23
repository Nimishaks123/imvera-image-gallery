import type { IImageRepository } from "../../../domain/repositories/IImageRepository.js";
import type { IFileStorage } from "../../interfaces/IFileStorage.js";
import type { IDeleteImageUseCase } from "../../interfaces/IDeleteImageUseCase.js";
import { AppError } from "../../../common/errors/AppError.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class DeleteImageUseCase implements IDeleteImageUseCase {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new AppError("Image not found", StatusCodes.NOT_FOUND);
    }
    if (image.userId !== userId) {
      throw new AppError("Access denied to this image", StatusCodes.FORBIDDEN);
    }

    try {
      await this.fileStorage.delete(image.key);
    } catch (err) {
      throw new AppError("Failed to delete image from S3 storage", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    await this.imageRepository.delete(id);
  }
}
