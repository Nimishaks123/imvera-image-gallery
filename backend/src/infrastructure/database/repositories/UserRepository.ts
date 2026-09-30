import type { IUserRepository, CreateUserData } from "../../../domain/repositories/IUserRepository.js";
import type { User } from "../../../domain/entities/User.js";
import { UserModel, type UserDocument, type IUserFields } from "../models/UserModel.js";
import { AppError } from "../../../common/errors/AppError.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";
import { BaseRepository } from "./BaseRepository.js";

export class UserRepository
  extends BaseRepository<User, UserDocument, CreateUserData, IUserFields>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  protected toEntity(doc: UserDocument): User {
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

  override async create(data: CreateUserData): Promise<User> {
    try {
      return await super.create(data);
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

  override async update(user: User): Promise<User> {
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
