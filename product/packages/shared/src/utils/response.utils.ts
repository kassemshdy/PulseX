import { ApiResponse, IApiError, PaginationMeta } from '../types';

/**
 * Custom Error class for API errors that can be thrown and caught
 */
export class ApiError extends Error implements IApiError {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export function successResponse<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(meta && { meta }),
  };
}

export function errorResponse(error: IApiError): ApiResponse {
  return {
    success: false,
    error,
  };
}

export function paginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export function createApiError(
  code: string,
  message: string,
  details?: Record<string, unknown>
): ApiError {
  return new ApiError(code, message, details);
}

