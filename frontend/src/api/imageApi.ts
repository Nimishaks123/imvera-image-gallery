import apiClient from "./axios.ts";
import type { ApiSuccessResponse } from "../types/api.ts";
import type { Image } from "../types/image.ts";

export const imageApi = {
  getImages: async (): Promise<Image[]> => {
    const response = await apiClient.get<ApiSuccessResponse<Image[]>>("/images");
    return response.data.data;
  },

  getImageById: async (id: string): Promise<Image> => {
    const response = await apiClient.get<ApiSuccessResponse<Image>>(`/images/${id}`);
    return response.data.data;
  },

  upload: async (formData: FormData): Promise<Image[]> => {
    const response = await apiClient.post<ApiSuccessResponse<Image[]>>("/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  update: async (id: string, formData: FormData): Promise<Image> => {
    const response = await apiClient.put<ApiSuccessResponse<Image>>(`/images/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiSuccessResponse<void>>(`/images/${id}`);
  },

  reorder: async (imageIds: string[]): Promise<void> => {
    await apiClient.post<ApiSuccessResponse<void>>("/images/reorder", { imageIds });
  },
};
