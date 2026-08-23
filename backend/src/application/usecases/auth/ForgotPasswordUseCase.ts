import crypto from "crypto";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { IMailer } from "../../interfaces/IMailer.js";
import type { IForgotPasswordUseCase } from "../../interfaces/IForgotPasswordUseCase.js";

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);
    
    if (!user) {
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000);

    await this.userRepository.update(user);
    await this.mailer.sendPasswordResetEmail(user.email, token);
  }
}
