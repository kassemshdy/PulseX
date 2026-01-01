import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, ERROR_CODES, createApiError } from '@cms/shared';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Handle known API errors
  if (error && typeof error === 'object' && 'code' in error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error,
    });
    return;
  }

  // Handle Zod validation errors
  if (error.name === 'ZodError') {
    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      error: createApiError(ERROR_CODES.VALIDATION_ERROR, 'Validation failed', {
        issues: (error as any).issues,
      }),
    });
    return;
  }

  // Default error
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: createApiError(
      ERROR_CODES.INTERNAL_ERROR,
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'An internal error occurred'
    ),
  });
};

