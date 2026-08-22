import mongoose from "mongoose";
import type { HydratedDocument } from "mongoose";

export interface IImageFields {
  userId: mongoose.Types.ObjectId;
  title: string;
  key: string;
  order: number;
}

export type ImageDocument = HydratedDocument<IImageFields> & {
  createdAt: Date;
  updatedAt: Date;
};

const imageSchema = new mongoose.Schema<IImageFields>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    key: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

imageSchema.index({ userId: 1, order: 1 });

export const ImageModel = mongoose.model<IImageFields>("Image", imageSchema);
