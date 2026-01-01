import { prisma, Taxonomy } from '@cms/database';

export class TaxonomyService {
  async findById(id: string, subscriptionId: string): Promise<Taxonomy | null> {
    return prisma.taxonomy.findFirst({
      where: { id, subscriptionId },
      include: {
        terms: true,
      },
    });
  }

  async findAll(subscriptionId: string): Promise<Taxonomy[]> {
    return prisma.taxonomy.findMany({
      where: { subscriptionId },
      include: {
        terms: true,
      },
    });
  }

  async create(
    data: {
      name: string;
      slug: string;
      description?: string;
      isHierarchical?: boolean;
      allowAutoAdd?: boolean;
    },
    subscriptionId: string
  ): Promise<Taxonomy> {
    return prisma.taxonomy.create({
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
      isHierarchical: boolean;
      allowAutoAdd: boolean;
    }>,
    subscriptionId: string
  ): Promise<Taxonomy> {
    return prisma.taxonomy.update({
      where: { id },
      data,
    });
  }
}

