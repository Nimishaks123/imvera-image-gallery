import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { IPasswordHasher } from "../../interfaces/IPasswordHasher.js";
import { AppError } from "../../../common/errors/AppError.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByResetToken(token);
    if (!user) {
      throw new AppError("Password reset token is invalid or has expired", StatusCodes.BAD_REQUEST);
    }

    user.password = await this.passwordHasher.hash(newPassword);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await this.userRepository.update(user);
  }
}
