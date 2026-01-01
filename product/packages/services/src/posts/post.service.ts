import { prisma, Post, PostStatus, Prisma } from '@cms/database';
import { ERROR_CODES, createApiError, PaginationDto } from '@cms/shared';

export class PostService {
  async findById(id: string, subscriptionId: string): Promise<Post | null> {
    return prisma.post.findFirst({
      where: { id, subscriptionId },
      include: {
        meta: true,
        media: { include: { media: true } },
        terms: { include: { term: { include: { taxonomy: true } } } },
        sourceRelations: { include: { targetPost: true } },
        targetRelations: { include: { sourcePost: true } },
      },
    });
  }

  async findAll(
    subscriptionId: string,
    pagination: PaginationDto & { postTypeId?: string; status?: PostStatus }
  ): Promise<{ items: Post[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'asc', postTypeId, status } = pagination;

    const where: Prisma.PostWhereInput = {
      subscriptionId,
      ...(postTypeId && { postTypeId }),
      ...(status && { status }),
    };

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          meta: true,
          media: { include: { media: true } },
          terms: { include: { term: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.post.count({ where }),
    ]);

    return { items, total };
  }

  async create(
    data: {
      postTypeId: string;
      title: string;
      slug: string;
      content?: string;
      excerpt?: string;
      status?: PostStatus;
      seoTitle?: string;
      seoDescription?: string;
      meta?: Record<string, string>;
      termIds?: string[];
      mediaIds?: string[];
    },
    createdById: string,
    subscriptionId: string
  ): Promise<Post> {
    const { meta, termIds, mediaIds, ...postData } = data;

    const post = await prisma.post.create({
      data: {
        ...postData,
        createdById,
        subscriptionId,
        status: postData.status || PostStatus.DRAFT,
        ...(meta && {
          meta: {
            create: Object.entries(meta).map(([key, value]) => ({
              key,
              value,
            })),
          },
        }),
        ...(termIds && {
          terms: {
            create: termIds.map((termId, index) => ({
              termId,
              order: index,
            })),
          },
        }),
        ...(mediaIds && {
          media: {
            create: mediaIds.map((mediaId, index) => ({
              mediaId,
              order: index,
              relationType: index === 0 ? 'FEATURED' : 'GALLERY',
            })),
          },
        }),
      },
      include: {
        meta: true,
        media: { include: { media: true } },
        terms: { include: { term: true } },
      },
    });

    return post;
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      content: string;
      excerpt: string;
      status: PostStatus;
      seoTitle: string;
      seoDescription: string;
      meta: Record<string, string>;
    }>,
    subscriptionId: string
  ): Promise<Post> {
    const { meta, ...updateData } = data;

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        ...(meta && {
          meta: {
            deleteMany: {},
            create: Object.entries(meta).map(([key, value]) => ({
              key,
              value,
            })),
          },
        }),
      },
      include: {
        meta: true,
        media: { include: { media: true } },
        terms: { include: { term: true } },
      },
    });

    return post;
  }

  async delete(id: string, subscriptionId: string): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  }

  async publish(id: string, subscriptionId: string): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data: {
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }
}

