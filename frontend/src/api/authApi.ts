import apiClient from "./axios.ts";
import type { ApiSuccessResponse } from "../types/api.ts";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth.ts";
import type { User } from "../types/user.ts";

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<ApiSuccessResponse<RegisterResponse>>(
      "/auth/register",
      data,
    );
    return response.data.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiSuccessResponse<LoginResponse>>(
      "/auth/login",
      data,
    );
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiSuccessResponse<User>>("/auth/me");
    return response.data.data;
  },

  forgotPassword: async (email: string): Promise<string> => {
    const response = await apiClient.post<ApiSuccessResponse<{ message: string }>>(
      "/auth/forgot-password",
      { email },
    );
    return response.data.data.message;
  },

  resetPassword: async (token: string, password: string): Promise<string> => {
    const response = await apiClient.post<ApiSuccessResponse<{ message: string }>>(
      "/auth/reset-password",
      { token, password },
    );
    return response.data.data.message;
  },
};
