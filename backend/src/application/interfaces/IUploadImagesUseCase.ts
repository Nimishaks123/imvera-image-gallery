import type { UploadedFile } from "./IFileStorage.js";
import type { Image } from "../../domain/entities/Image.js";

export interface IUploadImagesUseCase {
  execute(userId: string, files: UploadedFile[], titles: string[]): Promise<Image[]>;
}
