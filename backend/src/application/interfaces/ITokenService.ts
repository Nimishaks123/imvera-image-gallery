export interface ITokenPayload {
  userId: string;
}

export interface ITokenService {
  generateToken(userId: string): string;
  verifyToken(token: string): ITokenPayload;
}
