import type { IImageRepository } from "../../../domain/repositories/IImageRepository.js";
import type { IReorderImagesUseCase } from "../../interfaces/IReorderImagesUseCase.js";
import { AppError } from "../../../common/errors/AppError.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class ReorderImagesUseCase implements IReorderImagesUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(userId: string, imageIds: string[]): Promise<void> {
    const userImages = await this.imageRepository.findAllByUserId(userId);
    const userImageIds = new Set(userImages.map((img) => img.id));

    if (imageIds.length !== userImages.length) {
      throw new AppError("Invalid image ID count for reordering", StatusCodes.BAD_REQUEST);
    }

    const uniqueSubmittedIds = new Set(imageIds);
    if (uniqueSubmittedIds.size !== imageIds.length) {
      throw new AppError("Submitted image IDs contain duplicates", StatusCodes.BAD_REQUEST);
    }

    for (const id of imageIds) {
      if (!userImageIds.has(id)) {
        throw new AppError("Access denied or invalid image ID provided", StatusCodes.BAD_REQUEST);
      }
    }

    const items = imageIds.map((id, index) => ({
      id,
      order: index,
    }));

    await this.imageRepository.bulkUpdateOrder(items);
  }
}
