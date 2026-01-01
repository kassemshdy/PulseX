import { prisma, Subscription } from '@cms/database';

export class SubscriptionService {
  async findById(id: string): Promise<Subscription | null> {
    return prisma.subscription.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Subscription | null> {
    return prisma.subscription.findUnique({
      where: { code },
    });
  }

  async findByHost(host: string): Promise<Subscription | null> {
    const subscriptions = await prisma.subscription.findMany();
    return subscriptions.find((sub) => sub.hosts.includes(host)) || null;
  }

  async create(data: {
    code: string;
    name: string;
    hosts: string[];
    master?: boolean;
    landingPage?: string;
    settings?: Record<string, unknown>;
  }): Promise<Subscription> {
    return prisma.subscription.create({
      data: {
        ...data,
        master: data.master || false,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      hosts: string[];
      landingPage: string;
      settings: Record<string, unknown>;
    }>
  ): Promise<Subscription> {
    return prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async checkSubdomainAvailability(subdomain: string): Promise<{
    available: boolean;
    error?: string;
    subdomain?: string;
    fullDomain?: string;
  }> {
    if (!subdomain) {
      return {
        available: false,
        error: 'Subdomain is required',
      };
    }

    const subdomainLower = subdomain.toLowerCase();

    // Reserved subdomains
    const reservedSubdomains = [
      'www', 'admin', 'api', 'app', 'mail', 'ftp', 'localhost',
      'staging', 'dev', 'test', 'demo', 'support', 'help',
      'blog', 'shop', 'store', 'cdn', 'static', 'assets',
    ];

    if (reservedSubdomains.includes(subdomainLower)) {
      return {
        available: false,
        error: 'This subdomain is reserved',
      };
    }

    // Check format (alphanumeric and hyphens, 3-20 chars)
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]{1,18}[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomainLower)) {
      return {
        available: false,
        error: 'Subdomain must be 3-20 characters (alphanumeric and hyphens only)',
      };
    }

    // Check if exists in database
    const existing = await prisma.subscription.findUnique({
      where: { code: subdomainLower },
    });

    if (existing) {
      return {
        available: false,
        error: 'This subdomain is already taken',
      };
    }

    return {
      available: true,
      subdomain: subdomainLower,
      fullDomain: `${subdomainLower}.pulsex.com`,
    };
  }
}

