import type { User } from "../entities/User.js";
import type { IBaseRepository } from "./IBaseRepository.js";

export type CreateUserData = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "passwordResetToken" | "passwordResetExpires"
>;

export interface IUserRepository extends IBaseRepository<User, CreateUserData> {
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findByResetToken(token: string): Promise<User | null>;
}

