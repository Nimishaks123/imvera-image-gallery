import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { IPasswordHasher } from "../../interfaces/IPasswordHasher.js";
import type { ITokenService } from "../../interfaces/ITokenService.js";
import type { LoginUserDTO, LoginUserResponseDTO } from "../../dto/auth/LoginUserDTO.js";
import type { ILoginUserUseCase } from "../../interfaces/ILoginUserUseCase.js";
import { UserMapper } from "../../mappers/UserMapper.js";
import { AppError } from "../../../common/errors/AppError.js";
import { Messages } from "../../../common/constants/messages.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginUserDTO): Promise<LoginUserResponseDTO> {
    const email = dto.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(Messages.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
    }

    const passwordMatches = await this.passwordHasher.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new AppError(Messages.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
    }

    const token = this.tokenService.generateToken(user.id);

    return {
      user: UserMapper.toProfile(user),
      token,
    };
  }
}
