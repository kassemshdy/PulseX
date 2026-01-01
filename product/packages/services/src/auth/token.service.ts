import jwt from 'jsonwebtoken';
import { User, UserRole } from '@cms/database';
import { ERROR_CODES, createApiError } from '@cms/shared';

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  subscriptionId: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = '7d';

  constructor(
    accessTokenSecret?: string,
    refreshTokenSecret?: string
  ) {
    this.accessTokenSecret = accessTokenSecret || process.env.JWT_ACCESS_SECRET || 'access-secret';
    this.refreshTokenSecret = refreshTokenSecret || process.env.JWT_REFRESH_SECRET || 'refresh-secret';
  }

  generateTokens(user: User): Tokens {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionId: user.subscriptionId,
    };

    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });

    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw createApiError(ERROR_CODES.TOKEN_EXPIRED, 'Access token has expired');
      }
      throw createApiError(ERROR_CODES.TOKEN_INVALID, 'Invalid access token');
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw createApiError(ERROR_CODES.TOKEN_EXPIRED, 'Refresh token has expired');
      }
      throw createApiError(ERROR_CODES.TOKEN_INVALID, 'Invalid refresh token');
    }
  }

  refreshAccessToken(refreshToken: string): string {
    const payload = this.verifyRefreshToken(refreshToken);

    const newPayload: TokenPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      subscriptionId: payload.subscriptionId,
    };

    return jwt.sign(newPayload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  generateAccessToken(payload: Partial<TokenPayload>): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: '7d', // Match signup flow
    });
  }

  generateRefreshToken(payload: { userId: string; subscriptionId: string }): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: '30d', // Match signup flow
    });
  }
}

