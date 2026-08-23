import type { LoginUserDTO, LoginUserResponseDTO } from "../dto/auth/LoginUserDTO.js";

export interface ILoginUserUseCase {
  execute(dto: LoginUserDTO): Promise<LoginUserResponseDTO>;
}
