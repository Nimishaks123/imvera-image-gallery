import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import type { UserProfileDTO } from "../../dto/auth/UserProfileDTO.js";
import { UserMapper } from "../../mappers/UserMapper.js";
import { AppError } from "../../../common/errors/AppError.js";
import { Messages } from "../../../common/constants/messages.js";
import { StatusCodes } from "../../../common/constants/statusCodes.js";

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserProfileDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return UserMapper.toProfile(user);
  }
}
