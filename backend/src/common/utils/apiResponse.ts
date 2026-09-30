export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

export function successResponse<T>(data: T, message?: string): ApiSuccessResponse<T> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  if (message !== undefined) {
    response.message = message;
  }
  return response;
}

export function messageResponse(message: string): ApiSuccessResponse<never> {
  return {
    success: true,
    message,
  };
}

export function errorResponse(message: string): ApiErrorResponse {
  return {
    success: false,
    message,
  };
}
