import type { Request, Response } from "express";
import type { IRegisterUserUseCase } from "../../../application/interfaces/IRegisterUserUseCase.js";
import type { ILoginUserUseCase } from "../../../application/interfaces/ILoginUserUseCase.js";
import type { IGetCurrentUserUseCase } from "../../../application/interfaces/IGetCurrentUserUseCase.js";
import type { IForgotPasswordUseCase } from "../../../application/interfaces/IForgotPasswordUseCase.js";
import type { IResetPasswordUseCase } from "../../../application/interfaces/IResetPasswordUseCase.js";
import type { RegisterUserDTO } from "../../../application/dto/auth/RegisterUserDTO.js";
import type { LoginUserDTO } from "../../../application/dto/auth/LoginUserDTO.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";
import { catchAsync } from "../../../common/utils/catchAsync.js";
import { successResponse } from "../../../common/utils/apiResponse.js";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: IRegisterUserUseCase,
    private readonly loginUserUseCase: ILoginUserUseCase,
    private readonly getCurrentUserUseCase: IGetCurrentUserUseCase,
    private readonly forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly resetPasswordUseCase: IResetPasswordUseCase,
  ) {}

  register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto: RegisterUserDTO = {
      name: req.body.name as string,
      email: req.body.email as string,
      phone: req.body.phone as string,
      password: req.body.password as string,
    };
    const result = await this.registerUserUseCase.execute(dto);
    res.status(StatusCodes.CREATED).json(successResponse(result));
  });

  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto: LoginUserDTO = {
      email: req.body.email as string,
      password: req.body.password as string,
    };
    const result = await this.loginUserUseCase.execute(dto);
    res.status(StatusCodes.OK).json(successResponse(result));
  });

  me = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.getCurrentUserUseCase.execute(req.user!.id);
    res.status(StatusCodes.OK).json(successResponse(result));
  });

  forgotPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    await this.forgotPasswordUseCase.execute(req.body.email as string);
    res.status(StatusCodes.OK).json(
      successResponse({
        message: "If a matching email is found, a password reset link will be sent shortly.",
      }),
    );
  });

  resetPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    await this.resetPasswordUseCase.execute(
      req.body.token as string,
      req.body.password as string,
    );
    res.status(StatusCodes.OK).json(
      successResponse({
        message: "Your password has been successfully reset. You can now log in.",
      }),
    );
  });
}


