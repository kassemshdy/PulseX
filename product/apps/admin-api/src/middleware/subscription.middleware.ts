import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '@cms/services';
import { ERROR_CODES, HTTP_STATUS, createApiError } from '@cms/shared';

const subscriptionService = new SubscriptionService();

export interface SubscriptionRequest extends Request {
  subscription?: {
    id: string;
    code: string;
    name: string;
  };
}

export const subscriptionMiddleware = async (
  req: SubscriptionRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to resolve subscription from header
    const subscriptionCode = req.headers['x-subscription-code'] as string;

    if (subscriptionCode) {
      const subscription = await subscriptionService.findByCode(subscriptionCode);

      if (!subscription) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: createApiError(ERROR_CODES.NOT_FOUND, 'Subscription not found'),
        });
        return;
      }

      req.subscription = {
        id: subscription.id,
        code: subscription.code,
        name: subscription.name,
      };

      next();
      return;
    }

    // Try to resolve from host
    const host = req.headers.host || '';
    const subscription = await subscriptionService.findByHost(host);

    if (!subscription) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: createApiError(ERROR_CODES.NOT_FOUND, 'Subscription not found for this host'),
      });
      return;
    }

    req.subscription = {
      id: subscription.id,
      code: subscription.code,
      name: subscription.name,
    };

    next();
  } catch (error) {
    console.error('Subscription resolution error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: createApiError(ERROR_CODES.INTERNAL_ERROR, 'Failed to resolve subscription'),
    });
  }
};

