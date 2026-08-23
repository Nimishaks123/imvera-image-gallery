import type { Request, Response, NextFunction } from "express";
import type { IUploadImagesUseCase } from "../../../application/interfaces/IUploadImagesUseCase.js";
import type { IGetImagesUseCase } from "../../../application/interfaces/IGetImagesUseCase.js";
import type { IGetImageByIdUseCase } from "../../../application/interfaces/IGetImageByIdUseCase.js";
import type { IUpdateImageUseCase } from "../../../application/interfaces/IUpdateImageUseCase.js";
import type { IDeleteImageUseCase } from "../../../application/interfaces/IDeleteImageUseCase.js";
import type { IReorderImagesUseCase } from "../../../application/interfaces/IReorderImagesUseCase.js";
import { ImageMapper } from "../../../application/mappers/ImageMapper.js";
import { AppError } from "../../../common/errors/AppError.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class ImageController {
  constructor(
    private readonly uploadImagesUseCase: IUploadImagesUseCase,
    private readonly getImagesUseCase: IGetImagesUseCase,
    private readonly getImageByIdUseCase: IGetImageByIdUseCase,
    private readonly updateImageUseCase: IUpdateImageUseCase,
    private readonly deleteImageUseCase: IDeleteImageUseCase,
    private readonly reorderImagesUseCase: IReorderImagesUseCase,
  ) {}

  uploadImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        throw new AppError("No files uploaded", StatusCodes.BAD_REQUEST);
      }

      let titles: string[] = [];
      const rawTitles = req.body.titles;
      if (rawTitles) {
        if (Array.isArray(rawTitles)) {
          titles = rawTitles.map(String);
        } else if (typeof rawTitles === "string") {
          try {
            const parsed = JSON.parse(rawTitles);
            titles = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
          } catch {
            titles = [rawTitles];
          }
        }
      }

      const uploadedFiles = files.map((file) => ({
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalname: file.originalname,
        size: file.size,
      }));

      const images = await this.uploadImagesUseCase.execute(
        req.user!.id,
        uploadedFiles,
        titles,
      );

      const data = images.map(ImageMapper.toResponseDTO);
      res.status(StatusCodes.CREATED).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const images = await this.getImagesUseCase.execute(req.user!.id);
      const data = images.map(ImageMapper.toResponseDTO);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getImageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const image = await this.getImageByIdUseCase.execute(req.params.id, req.user!.id);
      res.status(StatusCodes.OK).json({ success: true, data: ImageMapper.toResponseDTO(image) });
    } catch (err) {
      next(err);
    }
  };

  updateImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file
        ? {
            buffer: req.file.buffer,
            mimetype: req.file.mimetype,
            originalname: req.file.originalname,
            size: req.file.size,
          }
        : undefined;

      const image = await this.updateImageUseCase.execute(
        req.params.id,
        req.user!.id,
        req.body.title,
        file,
      );

      res.status(StatusCodes.OK).json({ success: true, data: ImageMapper.toResponseDTO(image) });
    } catch (err) {
      next(err);
    }
  };

  deleteImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteImageUseCase.execute(req.params.id, req.user!.id);
      res.status(StatusCodes.OK).json({ success: true, message: "Image deleted successfully" });
    } catch (err) {
      next(err);
    }
  };

  reorderImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { imageIds } = req.body;
      if (!Array.isArray(imageIds)) {
        throw new AppError("imageIds must be an array of strings", StatusCodes.BAD_REQUEST);
      }

      await this.reorderImagesUseCase.execute(req.user!.id, imageIds.map(String));
      res.status(StatusCodes.OK).json({ success: true, message: "Images reordered successfully" });
    } catch (err) {
      next(err);
    }
  };
}
