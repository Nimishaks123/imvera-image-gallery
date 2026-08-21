import type { UserProfileDTO } from "./UserProfileDTO.js";

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginUserResponseDTO {
  user: UserProfileDTO;
  token: string;
}
