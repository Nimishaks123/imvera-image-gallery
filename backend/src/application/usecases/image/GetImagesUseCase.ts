import type { IImageRepository } from "../../../domain/repositories/IImageRepository.js";
import type { IFileStorage } from "../../interfaces/IFileStorage.js";
import type { Image } from "../../../domain/entities/Image.js";
import type { IGetImagesUseCase } from "../../interfaces/IGetImagesUseCase.js";

export class GetImagesUseCase implements IGetImagesUseCase {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(userId: string): Promise<Image[]> {
    const images = await this.imageRepository.findAllByUserId(userId);
    for (const image of images) {
      image.url = await this.fileStorage.getPresignedUrl(image.key, 3600);
    }
    return images;
  }
}
