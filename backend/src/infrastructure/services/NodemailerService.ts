import nodemailer from "nodemailer";
import type { IMailer } from "../../application/interfaces/IMailer.js";
import { env } from "../../common/config/env.js";

export class NodemailerService implements IMailer {
  private readonly transporter: nodemailer.Transporter | null = null;

  constructor() {
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
    console.log(`[MAILER_DIAGNOSTIC] Attempting password reset email.`);
    console.log(`[MAILER_DIAGNOSTIC] SMTP Host: ${host}`);
    console.log(`[MAILER_DIAGNOSTIC] SMTP Port: ${port}`);
    console.log(`[MAILER_DIAGNOSTIC] SMTP User Configured: ${!!user}`);
    console.log(`[MAILER_DIAGNOSTIC] Transporter Created: ${!!this.transporter}`);

    if (!this.transporter) {
      console.warn("[MAILER_DIAGNOSTIC] Transporter not created due to missing SMTP configuration.");
      return;
    }

    try {
      console.log("[MAILER_DIAGNOSTIC] Verifying connection configuration...");
      await this.transporter.verify();
      console.log("[MAILER_DIAGNOSTIC] Transporter verification: SUCCESS");
    } catch (verifyErr: any) {
      console.error("[MAILER_DIAGNOSTIC] Transporter verification: FAILED", verifyErr.message || verifyErr);
      throw verifyErr;
    }

    try {
      console.log("[MAILER_DIAGNOSTIC] Sending email via Nodemailer...");
      const info = await this.transporter.sendMail({
        from: env.smtp.from ? `"Imvera Support" <${env.smtp.from}>` : `"Imvera Support" <${env.smtp.user}>`,
        to,
        subject: "Imvera — Password Reset Request",
        text,
      });
      console.log("[MAILER_DIAGNOSTIC] sendMail: SUCCESS", { messageId: info.messageId });
    } catch (sendErr: any) {
      console.error("[MAILER_DIAGNOSTIC] sendMail: FAILED", sendErr.message || sendErr);
      throw sendErr;
    }
  }
}
