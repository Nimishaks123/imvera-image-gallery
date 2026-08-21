import type { Request, Response, NextFunction } from "express";
import type { RegisterUserUseCase } from "../../../application/usecases/auth/RegisterUserUseCase.js";
import type { LoginUserUseCase } from "../../../application/usecases/auth/LoginUserUseCase.js";
import type { GetCurrentUserUseCase } from "../../../application/usecases/auth/GetCurrentUserUseCase.js";
import type { RegisterUserDTO } from "../../../application/dto/auth/RegisterUserDTO.js";
import type { LoginUserDTO } from "../../../application/dto/auth/LoginUserDTO.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: RegisterUserDTO = {
        name: req.body.name as string,
        email: req.body.email as string,
        phone: req.body.phone as string,
        password: req.body.password as string,
      };
      const result = await this.registerUserUseCase.execute(dto);
      res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: LoginUserDTO = {
        email: req.body.email as string,
        password: req.body.password as string,
      };
      const result = await this.loginUserUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getCurrentUserUseCase.execute(req.user!.id);
      res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}
