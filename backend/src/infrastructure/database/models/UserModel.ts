import mongoose from "mongoose";
import type { HydratedDocument } from "mongoose";

export interface IUserFields {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export type UserDocument = HydratedDocument<IUserFields> & {
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new mongoose.Schema<IUserFields>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUserFields>("User", userSchema);
