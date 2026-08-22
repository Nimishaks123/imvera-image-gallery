import type { Image } from "../../domain/entities/Image.js";
import type { ImageResponseDTO } from "../dto/image/ImageResponseDTO.js";

export class ImageMapper {
  static toResponseDTO(image: Image): ImageResponseDTO {
    return {
      id: image.id,
      title: image.title,
      url: image.url ?? "",
      order: image.order,
      createdAt: image.createdAt.toISOString(),
      updatedAt: image.updatedAt.toISOString(),
    };
  }
}
