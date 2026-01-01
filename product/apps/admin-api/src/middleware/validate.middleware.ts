import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { HTTP_STATUS, ERROR_CODES, createApiError } from '@cms/shared';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        success: false,
        error: createApiError(ERROR_CODES.VALIDATION_ERROR, 'Validation failed', {
          issues: error.issues,
        }),
      });
    }
  };
};

