import type { User } from "../entities/User.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: Omit<User, "id" | "createdAt" | "updatedAt" | "passwordResetToken" | "passwordResetExpires">): Promise<User>;
  update(user: User): Promise<User>;
  findByResetToken(token: string): Promise<User | null>;
}
