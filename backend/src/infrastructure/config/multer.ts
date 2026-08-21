import multer from "multer";
import { AppError } from "../../common/errors/AppError.js";
import { StatusCodes } from "../../common/constants/statusCodes.js";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    const allowed: readonly string[] = ALLOWED_IMAGE_MIME_TYPES;
    if (!allowed.includes(file.mimetype)) {
      callback(
        new AppError(
          "Only JPEG, PNG, WebP, and GIF images are allowed",
          StatusCodes.BAD_REQUEST,
        ),
      );
      return;
    }
    callback(null, true);
  },
});
