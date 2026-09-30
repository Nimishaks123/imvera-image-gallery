import type { ILogger } from "../../application/interfaces/ILogger.js";
import nodemailer from "nodemailer";
import type { IMailer } from "../../application/interfaces/IMailer.js";
import { env } from "../../common/config/env.js";

export class NodemailerService implements IMailer {
  private readonly transporter: nodemailer.Transporter | null = null;

  constructor(private readonly logger: ILogger) {
    const { host, port, user, password } = env.smtp;
    if (host && user && password) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass: password },
      });
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${env.clientUrl}/reset-password?token=${token}`;
    const text = `You are receiving this email because you requested a password reset. Please click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    const { host, port, user } = env.smtp;
   this.logger.debug("Attempting password reset email", {
      smtpHost: host,
      smtpPort: port,
      smtpUserConfigured: !!user,
      transporterCreated: !!this.transporter,
    });

    if (!this.transporter) {
     this.logger.warn(
        "Password reset email could not be sent because SMTP is not configured",
      );
      return;
    }

    try {
       this.logger.debug("Verifying SMTP connection");

      await this.transporter.verify();
       this.logger.info("SMTP connection verified successfully");
    } catch (verifyErr: unknown) {
      this.logger.error("SMTP connection verification failed", verifyErr);
      throw verifyErr;
    }

    try {
      this.logger.debug("Sending password reset email");
      const info = await this.transporter.sendMail({
        from: env.smtp.from ? `"Imvera Support" <${env.smtp.from}>` : `"Imvera Support" <${env.smtp.user}>`,
        to,
        subject: "Imvera — Password Reset Request",
        text,
      });
       this.logger.info("Password reset email sent successfully", {
        messageId: info.messageId,
      });
    } catch (sendErr: unknown) {
     this.logger.error("Failed to send password reset email", sendErr);
      throw sendErr;
    }
  }
}
