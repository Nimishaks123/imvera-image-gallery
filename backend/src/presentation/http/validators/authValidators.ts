import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../../common/errors/AppError.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export function validateRegisterInput(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as Record<string, unknown>;
  const { name, email, phone, password } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    next(new AppError("Name is required", StatusCodes.BAD_REQUEST));
    return;
  }

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    next(new AppError("Email is required", StatusCodes.BAD_REQUEST));
    return;
  }
  if (!isValidEmail(email.trim())) {
    next(new AppError("Invalid email format", StatusCodes.BAD_REQUEST));
    return;
  }

  if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
    next(new AppError("Phone number is required", StatusCodes.BAD_REQUEST));
    return;
  }
  if (!isValidPhone(phone.trim())) {
    next(new AppError("Invalid phone number — must contain 7 to 15 digits", StatusCodes.BAD_REQUEST));
    return;
  }

  if (!password || typeof password !== "string") {
    next(new AppError("Password is required", StatusCodes.BAD_REQUEST));
    return;
  }
  if (!isStrongPassword(password)) {
    next(
      new AppError(
        "Password must be at least 8 characters and contain at least one letter and one number",
        StatusCodes.BAD_REQUEST,
      ),
    );
    return;
  }

  next();
}

export function validateLoginInput(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as Record<string, unknown>;
  const { email, password } = body;

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    next(new AppError("Email is required", StatusCodes.BAD_REQUEST));
    return;
  }
  if (!isValidEmail(email.trim())) {
    next(new AppError("Invalid email format", StatusCodes.BAD_REQUEST));
    return;
  }

  if (!password || typeof password !== "string" || password.trim().length === 0) {
    next(new AppError("Password is required", StatusCodes.BAD_REQUEST));
    return;
  }

  next();
}

export function validateForgotPasswordInput(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as Record<string, unknown>;
  const { email } = body;

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    next(new AppError("Email is required", StatusCodes.BAD_REQUEST));
    return;
  }
  if (!isValidEmail(email.trim())) {
    next(new AppError("Invalid email format", StatusCodes.BAD_REQUEST));
    return;
  }

  next();
}

export function validateResetPasswordInput(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as Record<string, unknown>;
  const { token, password } = body;

  if (!token || typeof token !== "string" || token.trim().length === 0) {
    next(new AppError("Token is required", StatusCodes.BAD_REQUEST));
    return;
  }

  if (!password || typeof password !== "string") {
    next(new AppError("Password is required", StatusCodes.BAD_REQUEST));
    return;
  }
  if (!isStrongPassword(password)) {
    next(
      new AppError(
        "Password must be at least 8 characters and contain at least one letter and one number",
        StatusCodes.BAD_REQUEST,
      ),
    );
    return;
  }

  next();
}
