export interface IMailer {
  sendPasswordResetEmail(to: string, token: string): Promise<void>;
}
