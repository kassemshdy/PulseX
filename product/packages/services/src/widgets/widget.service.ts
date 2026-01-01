import { prisma, Widget, WidgetStatus } from '@cms/database';

export class WidgetService {
  async findById(id: string, subscriptionId: string): Promise<Widget | null> {
    return prisma.widget.findFirst({
      where: { id, subscriptionId },
    });
  }

  async findBySlug(slug: string, subscriptionId: string): Promise<Widget | null> {
    return prisma.widget.findFirst({
      where: { slug, subscriptionId },
    });
  }

  async findAll(subscriptionId: string, status?: WidgetStatus): Promise<Widget[]> {
    return prisma.widget.findMany({
      where: {
        subscriptionId,
        ...(status && { status }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(
    data: {
      name: string;
      slug: string;
      description?: string;
      status?: WidgetStatus;
      dataSource: unknown;
      viewOptions: unknown;
      platform: string;
      structure: unknown;
      cacheDuration?: number;
    },
    subscriptionId: string
  ): Promise<Widget> {
    return prisma.widget.create({
      data: {
        ...data,
        subscriptionId,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      status: WidgetStatus;
      dataSource: unknown;
      viewOptions: unknown;
      structure: unknown;
      cacheDuration: number;
    }>,
    subscriptionId: string
  ): Promise<Widget> {
    return prisma.widget.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, subscriptionId: string): Promise<void> {
    await prisma.widget.delete({
      where: { id },
    });
  }
}

