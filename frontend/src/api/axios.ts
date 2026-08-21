import axios from "axios";
import type { AxiosInstance } from "axios";

const AUTH_TOKEN_KEY = "auth_token";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login")
    ) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);

export { AUTH_TOKEN_KEY };
export default apiClient;
