import type { RegisterUserDTO, RegisterUserResponseDTO } from "../dto/auth/RegisterUserDTO.js";

export interface IRegisterUserUseCase {
  execute(dto: RegisterUserDTO): Promise<RegisterUserResponseDTO>;
}
