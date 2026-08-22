import { Router, type RequestHandler } from "express";
import type { AuthController } from "../controllers/AuthController.js";
import {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
} from "../validators/authValidators.js";

export function createAuthRouter(
  authController: AuthController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();
  router.post("/register", validateRegisterInput, authController.register);
  router.post("/login", validateLoginInput, authController.login);
  router.post("/forgot-password", validateForgotPasswordInput, authController.forgotPassword);
  router.post("/reset-password", validateResetPasswordInput, authController.resetPassword);
  router.get("/me", authMiddleware, authController.me);
  return router;
}
