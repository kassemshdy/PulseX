import { prisma, Channel, SocialPlatform, ChannelStatus } from '@cms/database';

export class ChannelService {
  async findById(id: string, subscriptionId: string): Promise<Channel | null> {
    return prisma.channel.findFirst({
      where: { id, subscriptionId },
    });
  }

  async findAll(subscriptionId: string, platform?: SocialPlatform): Promise<Channel[]> {
    return prisma.channel.findMany({
      where: {
        subscriptionId,
        ...(platform && { platform }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(
    data: {
      name: string;
      platform: SocialPlatform;
      platformAccountId: string;
      accountHandle: string;
      credentials: Record<string, unknown>;
      status?: ChannelStatus;
      metadata?: Record<string, unknown>;
      groupName?: string;
    },
    subscriptionId: string
  ): Promise<Channel> {
    return prisma.channel.create({
      data: {
        ...data,
        status: data.status || ChannelStatus.ACTIVE,
        subscriptionId,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      credentials: Record<string, unknown>;
      status: ChannelStatus;
      metadata: Record<string, unknown>;
    }>,
    subscriptionId: string
  ): Promise<Channel> {
    return prisma.channel.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, subscriptionId: string): Promise<void> {
    await prisma.channel.delete({
      where: { id },
    });
  }
}

