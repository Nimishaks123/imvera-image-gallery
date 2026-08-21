import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ITokenService } from "../../../application/interfaces/ITokenService.js";
import { AppError } from "../../../common/errors/AppError.js";
import { Messages } from "../../../common/constants/messages.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";
import { AuthConstants } from "../../../common/constants/auth.js";

export function createAuthMiddleware(tokenService: ITokenService): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers[AuthConstants.AUTHORIZATION_HEADER];

    if (!authHeader || typeof authHeader !== "string") {
      next(new AppError(Messages.AUTHENTICATION_REQUIRED, StatusCodes.UNAUTHORIZED));
      return;
    }

    if (!authHeader.startsWith(AuthConstants.BEARER_PREFIX)) {
      next(new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTHORIZED));
      return;
    }

    const token = authHeader.slice(AuthConstants.BEARER_PREFIX.length);

    if (!token) {
      next(new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTHORIZED));
      return;
    }

    try {
      const { userId } = tokenService.verifyToken(token);
      req.user = { id: userId };
      next();
    } catch (err) {
      next(err);
    }
  };
}
