import { Request, Response, NextFunction } from 'express';
import { TokenService } from '@cms/services';
import { UserRole } from '@cms/shared';
import { ERROR_CODES, HTTP_STATUS, createApiError } from '@cms/shared';

const tokenService = new TokenService();

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
    subscriptionId: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: createApiError(ERROR_CODES.UNAUTHORIZED, 'No token provided'),
      });
      return;
    }

    const token = authHeader.substring(7);
    const payload = tokenService.verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error,
      });
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: createApiError(ERROR_CODES.UNAUTHORIZED, 'Invalid token'),
      });
    }
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: createApiError(ERROR_CODES.UNAUTHORIZED, 'Not authenticated'),
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: createApiError(
          ERROR_CODES.FORBIDDEN,
          'You do not have permission to perform this action'
        ),
      });
      return;
    }

    next();
  };
};

