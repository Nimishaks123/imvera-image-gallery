import type { Image } from "../entities/Image.js";

export interface IImageRepository {
  findById(id: string): Promise<Image | null>;
  findAllByUserId(userId: string): Promise<Image[]>;
  create(data: Omit<Image, "id" | "createdAt" | "updatedAt">): Promise<Image>;
  update(image: Image): Promise<Image>;
  delete(id: string): Promise<void>;
  bulkUpdateOrder(items: { id: string; order: number }[]): Promise<void>;
  getMaxOrder(userId: string): Promise<number>;
}
