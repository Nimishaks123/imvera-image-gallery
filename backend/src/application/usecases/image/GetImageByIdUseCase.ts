import type { IImageRepository } from "../../../domain/repositories/IImageRepository.js";
import type { IFileStorage } from "../../interfaces/IFileStorage.js";
import type { Image } from "../../../domain/entities/Image.js";
import { AppError } from "../../../common/errors/AppError.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class GetImageByIdUseCase {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(id: string, userId: string): Promise<Image> {
    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new AppError("Image not found", StatusCodes.NOT_FOUND);
    }
    if (image.userId !== userId) {
      throw new AppError("Access denied to this image", StatusCodes.FORBIDDEN);
    }

    image.url = await this.fileStorage.getPresignedUrl(image.key, 3600);
    return image;
  }
}
