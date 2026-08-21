import type { User } from "../../domain/entities/User.js";
import type { RegisterUserResponseDTO } from "../dto/auth/RegisterUserDTO.js";
import type { UserProfileDTO } from "../dto/auth/UserProfileDTO.js";

export class UserMapper {
  static toRegisterResponse(user: User): RegisterUserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  static toProfile(user: User): UserProfileDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  }
}
