import type { User } from "./user.ts";

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
