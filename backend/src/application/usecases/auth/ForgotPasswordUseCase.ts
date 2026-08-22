import crypto from "crypto";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { IMailer } from "../../interfaces/IMailer.js";

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
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
