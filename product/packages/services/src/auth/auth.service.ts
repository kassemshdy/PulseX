import bcrypt from 'bcrypt';
import { prisma, User, UserRole } from '@cms/database';
import { ERROR_CODES, createApiError } from '@cms/shared';
import { TokenService } from './token.service';
import { SubscriptionService } from '../subscription/subscription.service';

export class AuthService {
  private readonly saltRounds = 10;
  private tokenService?: TokenService;
  private subscriptionService?: SubscriptionService;

  constructor(tokenService?: TokenService, subscriptionService?: SubscriptionService) {
    this.tokenService = tokenService;
    this.subscriptionService = subscriptionService;
  }

  async validateCredentials(email: string, password: string, subscriptionId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        email_subscriptionId: {
          email,
          subscriptionId,
        },
      },
    });

    if (!user) {
      throw createApiError(ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw createApiError(ERROR_CODES.FORBIDDEN, 'Account is inactive');
    }

    const isValid = await this.verifyPassword(password, user.passwordHash);

    if (!isValid) {
      throw createApiError(ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password');
    }

    return user;
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
    subscriptionId: string;
    language?: string;
  }): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email_subscriptionId: {
          email: data.email,
          subscriptionId: data.subscriptionId,
        },
      },
    });

    if (existingUser) {
      throw createApiError(ERROR_CODES.ALREADY_EXISTS, 'User with this email already exists');
    }

    const passwordHash = await this.hashPassword(data.password);

    return prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash,
        role: data.role || UserRole.VIEWER,
        subscriptionId: data.subscriptionId,
        language: data.language || 'en',
        isActive: true,
      },
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createApiError(ERROR_CODES.NOT_FOUND, 'User not found');
    }

    const isValid = await this.verifyPassword(currentPassword, user.passwordHash);

    if (!isValid) {
      throw createApiError(ERROR_CODES.INVALID_CREDENTIALS, 'Current password is incorrect');
    }

    const passwordHash = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      language?: string;
      avatarId?: string;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Email availability check
  async checkEmailAvailability(email: string): Promise<boolean> {
    if (!email || email.trim().length === 0) {
      return false;
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    return !user; // Available if no user found
  }

  // Signup with subscription creation
  async signup(data: {
    email: string;
    password: string;
    siteName: string;
    subdomain?: string; // Optional - will be auto-generated if not provided
  }): Promise<{
    user: User;
    subscription: any;
    accessToken: string;
    refreshToken: string;
    redirectUrl: string;
  }> {
    const { email, password, siteName } = data;
    
    // Auto-generate subdomain if not provided
    const subdomain = data.subdomain || 
      `${email.split('@')[0].replace(/[^a-z0-9]/g, '')}-${Date.now().toString(36)}`;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createApiError(ERROR_CODES.VALIDATION_ERROR, 'Invalid email address');
    }

    // Validate password
    if (password.length < 8) {
      throw createApiError(ERROR_CODES.VALIDATION_ERROR, 'Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      throw createApiError(ERROR_CODES.VALIDATION_ERROR, 'Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      throw createApiError(ERROR_CODES.VALIDATION_ERROR, 'Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw createApiError(ERROR_CODES.VALIDATION_ERROR, 'Password must contain at least one number');
    }

    // Validate site name
    if (!siteName || siteName.trim().length < 2) {
      throw createApiError(ERROR_CODES.VALIDATION_ERROR, 'Site name must be at least 2 characters');
    }
    if (siteName.length > 50) {
      throw createApiError(ERROR_CODES.VALIDATION_ERROR, 'Site name must be less than 50 characters');
    }

    // Validate subdomain
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]{1,18}[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain.toLowerCase())) {
      throw createApiError(
        ERROR_CODES.VALIDATION_ERROR,
        'Subdomain must be 3-20 characters (alphanumeric and hyphens only)'
      );
    }

    const reservedSubdomains = [
      'www', 'admin', 'api', 'app', 'mail', 'ftp', 'localhost',
      'staging', 'dev', 'test', 'demo', 'support', 'help',
      'blog', 'shop', 'store', 'cdn', 'static', 'assets',
    ];
    if (reservedSubdomains.includes(subdomain.toLowerCase())) {
      throw createApiError(ERROR_CODES.VALIDATION_ERROR, 'This subdomain is reserved and cannot be used');
    }

    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      throw createApiError(ERROR_CODES.ALREADY_EXISTS, 'Email address is already registered');
    }

    // Check if subdomain already exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { code: subdomain.toLowerCase() },
    });

    if (existingSubscription) {
      throw createApiError(ERROR_CODES.ALREADY_EXISTS, 'Subdomain is already taken');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create subscription and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create subscription
      const subscription = await tx.subscription.create({
        data: {
          code: subdomain.toLowerCase(),
          name: siteName.trim(),
          hosts: [`${subdomain.toLowerCase()}.pulsex.com`],
          master: false,
          landingPage: '/',
        },
      });

      // Create user
      const user = await tx.user.create({
        data: {
          firstName: siteName.trim().split(' ')[0] || 'User',
          lastName: siteName.trim().split(' ').slice(1).join(' ') || '',
          email: email.toLowerCase(),
          passwordHash,
          role: UserRole.ADMIN,
          language: 'en',
          isActive: true,
          subscriptionId: subscription.id,
        },
      });

      return { subscription, user };
    });

    // Generate JWT tokens
    const tokenService = this.tokenService || new TokenService();
    const accessToken = tokenService.generateAccessToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      subscriptionId: result.subscription.id,
    });

    const refreshToken = tokenService.generateRefreshToken({
      userId: result.user.id,
      subscriptionId: result.subscription.id,
    });

    return {
      user: result.user,
      subscription: result.subscription,
      accessToken,
      refreshToken,
      redirectUrl: process.env.NODE_ENV === 'production' 
        ? 'https://admin.pulsex.com' 
        : 'http://localhost:3000',
    };
  }
}

