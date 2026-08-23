import type { Image } from "../../domain/entities/Image.js";
import type { UploadedFile } from "./IFileStorage.js";

export interface IUpdateImageUseCase {
  execute(id: string, userId: string, title?: string, file?: UploadedFile): Promise<Image>;
}
