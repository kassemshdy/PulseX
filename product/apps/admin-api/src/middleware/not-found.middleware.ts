import { Request, Response } from 'express';
import { HTTP_STATUS, ERROR_CODES, createApiError } from '@cms/shared';

export const notFound = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: createApiError(ERROR_CODES.NOT_FOUND, `Route ${req.originalUrl} not found`),
  });
};

