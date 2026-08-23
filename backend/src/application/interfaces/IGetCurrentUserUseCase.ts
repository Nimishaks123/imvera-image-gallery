import type { UserProfileDTO } from "../dto/auth/UserProfileDTO.js";

export interface IGetCurrentUserUseCase {
  execute(userId: string): Promise<UserProfileDTO>;
}
