import type { Router } from "express";
import { env } from "../common/config/env.js";
import { UserRepository } from "../infrastructure/database/repositories/UserRepository.js";
import { BcryptPasswordHasher } from "../infrastructure/services/BcryptPasswordHasher.js";
import { JwtTokenService } from "../infrastructure/services/JwtTokenService.js";
import { S3FileStorage } from "../infrastructure/services/S3FileStorage.js";
import { RegisterUserUseCase } from "../application/usecases/auth/RegisterUserUseCase.js";
import { LoginUserUseCase } from "../application/usecases/auth/LoginUserUseCase.js";
import { GetCurrentUserUseCase } from "../application/usecases/auth/GetCurrentUserUseCase.js";
import { AuthController } from "../presentation/http/controllers/AuthController.js";
import { createAuthRouter } from "../presentation/http/routes/authRoutes.js";
import { createAuthMiddleware } from "../presentation/http/middlewares/authMiddleware.js";
import type { IFileStorage } from "../application/interfaces/IFileStorage.js";

export interface AppDependencies {
  authRouter: Router;
  fileStorage: IFileStorage;
}

export function buildDependencies(): AppDependencies {
  const userRepository = new UserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(env.jwtSecret, env.jwtExpiresIn);
  const fileStorage = new S3FileStorage({
    region: env.aws.region,
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
    bucket: env.aws.s3Bucket,
  });

  const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
  const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

  const authController = new AuthController(
    registerUserUseCase,
    loginUserUseCase,
    getCurrentUserUseCase,
  );

  const authMiddleware = createAuthMiddleware(tokenService);
  const authRouter = createAuthRouter(authController, authMiddleware);

  return { authRouter, fileStorage };
}
