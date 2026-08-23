import type { Image } from "../../domain/entities/Image.js";

export interface IGetImageByIdUseCase {
  execute(id: string, userId: string): Promise<Image>;
}
