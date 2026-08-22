import { Router, type RequestHandler } from "express";
import type { ImageController } from "../controllers/ImageController.js";
import { multerUpload } from "../../../infrastructure/config/multer.js";

export function createImageRouter(
  imageController: ImageController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post("/", multerUpload.array("files"), imageController.uploadImages);
  router.get("/", imageController.getImages);
  router.get("/:id", imageController.getImageById);
  router.put("/:id", multerUpload.single("file"), imageController.updateImage);
  router.delete("/:id", imageController.deleteImage);
  router.post("/reorder", imageController.reorderImages);

  return router;
}
