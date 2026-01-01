import { prisma, PostType } from '@cms/database';

export class PostTypeService {
  async findById(id: string, subscriptionId: string): Promise<PostType | null> {
    return prisma.postType.findFirst({
      where: { id, subscriptionId },
      include: {
        taxonomies: { include: { taxonomy: true } },
        sourceRelations: { include: { targetPostType: true } },
        targetRelations: { include: { sourcePostType: true } },
      },
    });
  }

  async findAll(subscriptionId: string): Promise<PostType[]> {
    return prisma.postType.findMany({
      where: { subscriptionId, isActive: true },
      include: {
        taxonomies: { include: { taxonomy: true } },
      },
    });
  }

  async create(
    data: {
      name: string;
      slug: string;
      description?: string;
      icon?: string;
      fields: unknown[];
      supportedMedia: string[];
    },
    subscriptionId: string
  ): Promise<PostType> {
    return prisma.postType.create({
      data: {
        ...data,
        subscriptionId,
        isActive: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      fields: unknown[];
      supportedMedia: string[];
      isActive: boolean;
    }>,
    subscriptionId: string
  ): Promise<PostType> {
    return prisma.postType.update({
      where: { id },
      data,
    });
  }
}

