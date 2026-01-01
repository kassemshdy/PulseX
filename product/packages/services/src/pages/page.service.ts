import { prisma, Page, PageStatus } from '@cms/database';

export class PageService {
  async findById(id: string, subscriptionId: string): Promise<Page | null> {
    return prisma.page.findFirst({
      where: { id, subscriptionId },
      include: {
        template: true,
      },
    });
  }

  async findBySlug(slug: string, subscriptionId: string): Promise<Page | null> {
    return prisma.page.findFirst({
      where: { slug, subscriptionId },
      include: {
        template: true,
      },
    });
  }

  async findAll(subscriptionId: string): Promise<Page[]> {
    return prisma.page.findMany({
      where: { subscriptionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(
    data: {
      title: string;
      slug: string;
      status?: PageStatus;
      layout: unknown;
      theme?: unknown;
      seoTitle?: string;
      seoDescription?: string;
      templateId?: string;
    },
    createdById: string,
    subscriptionId: string
  ): Promise<Page> {
    return prisma.page.create({
      data: {
        ...data,
        status: data.status || PageStatus.DRAFT,
        createdById,
        subscriptionId,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      status: PageStatus;
      layout: unknown;
      theme: unknown;
      seoTitle: string;
      seoDescription: string;
    }>,
    subscriptionId: string
  ): Promise<Page> {
    return prisma.page.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, subscriptionId: string): Promise<void> {
    await prisma.page.delete({
      where: { id },
    });
  }
}

