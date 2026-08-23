import type { Image } from "../../domain/entities/Image.js";

export interface IGetImagesUseCase {
  execute(userId: string): Promise<Image[]>;
}
