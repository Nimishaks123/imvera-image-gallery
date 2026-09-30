import { WinstonLogger } from "../infrastructure/logger/WinstonLogger.js";
import type { Router } from "express";
import { env } from "../common/config/env.js";
import { UserRepository } from "../infrastructure/database/repositories/UserRepository.js";
import { ImageRepository } from "../infrastructure/database/repositories/ImageRepository.js";
import { BcryptPasswordHasher } from "../infrastructure/services/BcryptPasswordHasher.js";
import { JwtTokenService } from "../infrastructure/services/JwtTokenService.js";
import { S3FileStorage } from "../infrastructure/services/S3FileStorage.js";
import { NodemailerService } from "../infrastructure/services/NodemailerService.js";
import { RegisterUserUseCase } from "../application/usecases/auth/RegisterUserUseCase.js";
import { LoginUserUseCase } from "../application/usecases/auth/LoginUserUseCase.js";
import { GetCurrentUserUseCase } from "../application/usecases/auth/GetCurrentUserUseCase.js";
import { ForgotPasswordUseCase } from "../application/usecases/auth/ForgotPasswordUseCase.js";
import { ResetPasswordUseCase } from "../application/usecases/auth/ResetPasswordUseCase.js";
import { UploadImagesUseCase } from "../application/usecases/image/UploadImagesUseCase.js";
import { GetImagesUseCase } from "../application/usecases/image/GetImagesUseCase.js";
import { GetImageByIdUseCase } from "../application/usecases/image/GetImageByIdUseCase.js";
import { UpdateImageUseCase } from "../application/usecases/image/UpdateImageUseCase.js";
import { DeleteImageUseCase } from "../application/usecases/image/DeleteImageUseCase.js";
import { ReorderImagesUseCase } from "../application/usecases/image/ReorderImagesUseCase.js";
import { AuthController } from "../presentation/http/controllers/AuthController.js";
import { ImageController } from "../presentation/http/controllers/ImageController.js";
import { createAuthRouter } from "../presentation/http/routes/authRoutes.js";
import { createImageRouter } from "../presentation/http/routes/imageRoutes.js";
import { createAuthMiddleware } from "../presentation/http/middlewares/authMiddleware.js";
import type { IFileStorage } from "../application/interfaces/IFileStorage.js";

export interface AppDependencies {
  authRouter: Router;
  imageRouter: Router;
  fileStorage: IFileStorage;
}

export function buildDependencies(): AppDependencies {
  const logger = new WinstonLogger();
  const userRepository = new UserRepository();
  const imageRepository = new ImageRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(env.jwtSecret, env.jwtExpiresIn);
  const fileStorage = new S3FileStorage({
    region: env.aws.region,
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
    bucket: env.aws.s3Bucket,
  });
  const mailer = new NodemailerService(logger);

  const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
  const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
  const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, mailer);
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordHasher);

  const uploadImagesUseCase = new UploadImagesUseCase(imageRepository, fileStorage,logger);
  const getImagesUseCase = new GetImagesUseCase(imageRepository, fileStorage);
  const getImageByIdUseCase = new GetImageByIdUseCase(imageRepository, fileStorage);
  const updateImageUseCase = new UpdateImageUseCase(imageRepository, fileStorage,logger);
  const deleteImageUseCase = new DeleteImageUseCase(imageRepository, fileStorage);
  const reorderImagesUseCase = new ReorderImagesUseCase(imageRepository);

  const authController = new AuthController(
    registerUserUseCase,
    loginUserUseCase,
    getCurrentUserUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase,
  );

  const imageController = new ImageController(
    uploadImagesUseCase,
    getImagesUseCase,
    getImageByIdUseCase,
    updateImageUseCase,
    deleteImageUseCase,
    reorderImagesUseCase,
  );

  const authMiddleware = createAuthMiddleware(tokenService);
  const authRouter = createAuthRouter(authController, authMiddleware);
  const imageRouter = createImageRouter(imageController, authMiddleware);

  return { authRouter, imageRouter, fileStorage };
}
