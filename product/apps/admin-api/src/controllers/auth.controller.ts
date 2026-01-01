import { Response, NextFunction } from 'express';
import { AuthService, TokenService } from '@cms/services';
import { successResponse, HTTP_STATUS } from '@cms/shared';
import { AuthRequest } from '../middleware/auth.middleware';
import { SubscriptionRequest } from '../middleware/subscription.middleware';

type CombinedRequest = AuthRequest & SubscriptionRequest;

const authService = new AuthService();
const tokenService = new TokenService();

export class AuthController {
  async login(req: CombinedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const subscriptionId = req.subscription?.id;

      if (!subscriptionId) {
        throw new Error('Subscription not resolved');
      }

      const user = await authService.validateCredentials(email, password, subscriptionId);
      const tokens = tokenService.generateTokens(user);

      res.status(HTTP_STATUS.OK).json(
        successResponse({
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          ...tokens,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async register(req: CombinedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscriptionId = req.subscription?.id;

      if (!subscriptionId) {
        throw new Error('Subscription not resolved');
      }

      const user = await authService.createUser({
        ...req.body,
        subscriptionId,
      });

      const tokens = tokenService.generateTokens(user);

      res.status(HTTP_STATUS.CREATED).json(
        successResponse({
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          ...tokens,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      res.status(HTTP_STATUS.OK).json(
        successResponse({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          language: user.language,
          avatarId: user.avatarId,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real implementation, you might want to blacklist the token
      res.status(HTTP_STATUS.OK).json(successResponse({ message: 'Logged out successfully' }));
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: CombinedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new Error('Refresh token required');
      }

      const accessToken = tokenService.refreshAccessToken(refreshToken);

      res.status(HTTP_STATUS.OK).json(
        successResponse({
          accessToken,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

