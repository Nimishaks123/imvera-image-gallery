import type { Image } from "../entities/Image.js";
import type { IBaseRepository } from "./IBaseRepository.js";

export interface IImageRepository extends IBaseRepository<Image> {
  findAllByUserId(userId: string): Promise<Image[]>;
  bulkUpdateOrder(items: { id: string; order: number }[]): Promise<void>;
  getMaxOrder(userId: string): Promise<number>;
}

