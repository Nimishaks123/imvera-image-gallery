import type { IImageRepository } from "../../../domain/repositories/IImageRepository.js";
import type { Image } from "../../../domain/entities/Image.js";
import { ImageModel, type ImageDocument, type IImageFields } from "../models/ImageModel.js";
import mongoose from "mongoose";
import { BaseRepository } from "./BaseRepository.js";

export class ImageRepository
  extends BaseRepository<Image, ImageDocument, Omit<Image, "id" | "createdAt" | "updatedAt">, IImageFields>
  implements IImageRepository
{
  constructor() {
    super(ImageModel);
  }

  protected toEntity(doc: ImageDocument): Image {
    return {
      id: doc._id.toHexString(),
      userId: doc.userId.toHexString(),
      title: doc.title,
      key: doc.key,
      order: doc.order,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findAllByUserId(userId: string): Promise<Image[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    const docs = await ImageModel.find({ userId })
      .sort({ order: 1 })
      .exec();
    return docs.map((doc) => this.toEntity(doc as ImageDocument));
  }

  override async create(data: Omit<Image, "id" | "createdAt" | "updatedAt">): Promise<Image> {
    const doc = await ImageModel.create({
      ...data,
      userId: new mongoose.Types.ObjectId(data.userId),
    });
    return this.toEntity(doc as ImageDocument);
  }

  override async update(image: Image): Promise<Image> {
    const doc = await ImageModel.findByIdAndUpdate(
      image.id,
      {
        title: image.title,
        key: image.key,
        order: image.order,
      },
      { new: true },
    ).exec();
    if (!doc) {
      throw new Error("Image not found");
    }
    return this.toEntity(doc as ImageDocument);
  }

  async bulkUpdateOrder(items: { id: string; order: number }[]): Promise<void> {
    const operations = items.map((item) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(item.id) },
        update: { $set: { order: item.order } },
      },
    }));
    await ImageModel.bulkWrite(operations);
  }

  async getMaxOrder(userId: string): Promise<number> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return -1;
    const result = await ImageModel.findOne({ userId })
      .sort({ order: -1 })
      .select("order")
      .exec();
    return result ? result.order : -1;
  }
}
