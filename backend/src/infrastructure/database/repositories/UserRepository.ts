import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { User } from "../../../domain/entities/User.js";
import { UserModel, type UserDocument } from "../models/UserModel.js";
import { AppError } from "../../../common/errors/AppError.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class UserRepository implements IUserRepository {
  private toEntity(doc: UserDocument): User {
    return {
      id: doc._id.toHexString(),
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      password: doc.password,
      passwordResetToken: doc.passwordResetToken,
      passwordResetExpires: doc.passwordResetExpires,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? this.toEntity(doc as UserDocument) : null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const doc = await UserModel.findOne({ phone }).exec();
    return doc ? this.toEntity(doc as UserDocument) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? this.toEntity(doc as UserDocument) : null;
  }

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt" | "passwordResetToken" | "passwordResetExpires">): Promise<User> {
    try {
      const doc = await UserModel.create(data);
      return this.toEntity(doc as UserDocument);
    } catch (err) {
      if (
        err !== null &&
        typeof err === "object" &&
        "code" in err &&
        err.code === 11000
      ) {
        throw new AppError("A user with this email or phone already exists", StatusCodes.CONFLICT);
      }
      throw err;
    }
  }

  async update(user: User): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(
      user.id,
      {
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        passwordResetToken: user.passwordResetToken,
        passwordResetExpires: user.passwordResetExpires,
      },
      { new: true },
    ).exec();
    if (!doc) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    return this.toEntity(doc as UserDocument);
  }

  async findByResetToken(token: string): Promise<User | null> {
    const doc = await UserModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).exec();
    return doc ? this.toEntity(doc as UserDocument) : null;
  }
}
