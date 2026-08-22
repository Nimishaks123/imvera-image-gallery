export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
