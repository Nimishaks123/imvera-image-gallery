import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import type { Router } from "express";
import { env } from "../common/config/env.js";
import { AppError } from "../common/errors/AppError.js";
import { StatusCodes } from "../common/constants/statusCodes.js";

interface AppRouters {
  authRouter: Router;
}

export function createApp({ authRouter }: AppRouters): Express {
  const app = express();

  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);

  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError("Route not found", StatusCodes.NOT_FOUND));
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ success: false, message: err.message });
      return;
    }
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
  });

  return app;
}
