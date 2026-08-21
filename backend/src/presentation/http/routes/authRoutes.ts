import { Router, type RequestHandler } from "express";
import type { AuthController } from "../controllers/AuthController.js";
import { validateRegisterInput, validateLoginInput } from "../validators/authValidators.js";

export function createAuthRouter(
  authController: AuthController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();
  router.post("/register", validateRegisterInput, authController.register);
  router.post("/login", validateLoginInput, authController.login);
  router.get("/me", authMiddleware, authController.me);
  return router;
}
