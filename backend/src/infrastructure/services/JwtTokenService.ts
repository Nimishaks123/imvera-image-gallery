import jwt from "jsonwebtoken";
import type { ITokenService, ITokenPayload } from "../../application/interfaces/ITokenService.js";
import { AppError } from "../../common/errors/AppError.js";
import { Messages } from "../../common/constants/messages.js";
import { StatusCodes } from "../../common/constants/statusCodes.js";

function isValidPayload(
  decoded: jwt.JwtPayload | string,
): decoded is jwt.JwtPayload & { sub: string } {
  return (
    typeof decoded === "object" &&
    decoded !== null &&
    typeof decoded.sub === "string" &&
    decoded.sub.length > 0
  );
}

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) {}

  generateToken(userId: string): string {
    return jwt.sign({ sub: userId }, this.secret, {
      expiresIn: this.expiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): ITokenPayload {
    let decoded: jwt.JwtPayload | string;

    try {
      decoded = jwt.verify(token, this.secret);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new AppError(Messages.TOKEN_EXPIRED, StatusCodes.UNAUTHORIZED);
      }
      throw new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTHORIZED);
    }

    if (!isValidPayload(decoded)) {
      throw new AppError(Messages.INVALID_TOKEN, StatusCodes.UNAUTHORIZED);
    }

    return { userId: decoded.sub };
  }
}
