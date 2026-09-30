import type { Model, UpdateQuery } from "mongoose";
import mongoose from "mongoose";
import type { IBaseRepository } from "../../../domain/repositories/IBaseRepository.js";

export abstract class BaseRepository<
  T extends { id: string },
  TDoc,
  TCreate = Omit<T, "id" | "createdAt" | "updatedAt">,
  TSchema = unknown,
> implements IBaseRepository<T, TCreate>
{
  constructor(protected readonly model: Model<TSchema>) {}

  protected abstract toEntity(doc: TDoc): T;

  async findById(id: string): Promise<T | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).exec();
    return doc ? this.toEntity(doc as TDoc) : null;
  }

  async create(data: TCreate): Promise<T> {
    const doc = await this.model.create(data as unknown as TSchema);
    return this.toEntity(doc as TDoc);
  }

  async update(entity: T): Promise<T> {
    const { id, ...updateData } = entity as Record<string, unknown>;
    const doc = await this.model
      .findByIdAndUpdate(id, updateData as UpdateQuery<TSchema>, { new: true })
      .exec();
    if (!doc) {
      throw new Error("Entity not found");
    }
    return this.toEntity(doc as TDoc);
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) return;
    await this.model.findByIdAndDelete(id).exec();
  }
}
