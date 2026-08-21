import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { IPasswordHasher } from "../../interfaces/IPasswordHasher.js";
import type { RegisterUserDTO, RegisterUserResponseDTO } from "../../dto/auth/RegisterUserDTO.js";
import { UserMapper } from "../../mappers/UserMapper.js";
import { AppError } from "../../../common/errors/AppError.js";
import { Messages } from "../../../common/constants/messages.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterUserDTO): Promise<RegisterUserResponseDTO> {
    const email = dto.email.trim().toLowerCase();
    const phone = dto.phone.trim();
    const name = dto.name.trim();

    const existingByEmail = await this.userRepository.findByEmail(email);
    if (existingByEmail) {
      throw new AppError(Messages.EMAIL_ALREADY_REGISTERED, StatusCodes.CONFLICT);
    }

    const existingByPhone = await this.userRepository.findByPhone(phone);
    if (existingByPhone) {
      throw new AppError(Messages.PHONE_ALREADY_REGISTERED, StatusCodes.CONFLICT);
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = await this.userRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return UserMapper.toRegisterResponse(user);
  }
}
