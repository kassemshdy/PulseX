import { prisma, Media, MediaType } from '@cms/database';

export class MediaService {
  async findById(id: string, subscriptionId: string): Promise<Media | null> {
    return prisma.media.findFirst({
      where: { id, subscriptionId },
    });
  }

  async findAll(subscriptionId: string, options?: {
    type?: MediaType;
    page?: number;
    limit?: number;
  }): Promise<{ items: Media[]; total: number }> {
    const { type, page = 1, limit = 20 } = options || {};

    const where = {
      subscriptionId,
      ...(type && { type }),
    };

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.media.count({ where }),
    ]);

    return { items, total };
  }

  async create(
    data: {
      filename: string;
      originalName: string;
      mimeType: string;
      type: MediaType;
      size: bigint;
      width?: number;
      height?: number;
      duration?: number;
      path: string;
      cdnUrl?: string;
      thumbnailUrl?: string;
      alt?: string;
      caption?: string;
      description?: string;
      tags?: string[];
      hash?: string;
      storage: string;
      isExternal: boolean;
      externalUrl?: string;
      metadata?: Record<string, unknown>;
    },
    uploadedById: string,
    subscriptionId: string
  ): Promise<Media> {
    return prisma.media.create({
      data: {
        ...data,
        uploadedById,
        subscriptionId,
      },
    });
  }

  async update(
    id: string,
    data: {
      alt?: string;
      caption?: string;
      description?: string;
      tags?: string[];
    },
    subscriptionId: string
  ): Promise<Media> {
    return prisma.media.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, subscriptionId: string): Promise<void> {
    await prisma.media.delete({
      where: { id },
    });
  }
}

