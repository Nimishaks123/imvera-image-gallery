import type { Request, Response, NextFunction } from "express";
import type { IRegisterUserUseCase } from "../../../application/interfaces/IRegisterUserUseCase.js";
import type { ILoginUserUseCase } from "../../../application/interfaces/ILoginUserUseCase.js";
import type { IGetCurrentUserUseCase } from "../../../application/interfaces/IGetCurrentUserUseCase.js";
import type { IForgotPasswordUseCase } from "../../../application/interfaces/IForgotPasswordUseCase.js";
import type { IResetPasswordUseCase } from "../../../application/interfaces/IResetPasswordUseCase.js";
import type { RegisterUserDTO } from "../../../application/dto/auth/RegisterUserDTO.js";
import type { LoginUserDTO } from "../../../application/dto/auth/LoginUserDTO.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: IRegisterUserUseCase,
    private readonly loginUserUseCase: ILoginUserUseCase,
    private readonly getCurrentUserUseCase: IGetCurrentUserUseCase,
    private readonly forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly resetPasswordUseCase: IResetPasswordUseCase,
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

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.forgotPasswordUseCase.execute(req.body.email as string);
      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          message: "If a matching email is found, a password reset link will be sent shortly.",
        },
      });
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.resetPasswordUseCase.execute(
        req.body.token as string,
        req.body.password as string,
      );
      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          message: "Your password has been successfully reset. You can now log in.",
        },
      });
    } catch (err) {
      next(err);
    }
  };
}
