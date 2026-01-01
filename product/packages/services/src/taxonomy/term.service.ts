import { prisma, Term } from '@cms/database';

export class TermService {
  async findById(id: string, subscriptionId: string): Promise<Term | null> {
    return prisma.term.findFirst({
      where: { id, subscriptionId },
      include: {
        taxonomy: true,
        parent: true,
        children: true,
      },
    });
  }

  async findByTaxonomy(taxonomyId: string, subscriptionId: string): Promise<Term[]> {
    return prisma.term.findMany({
      where: { taxonomyId, subscriptionId },
      include: {
        parent: true,
        children: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(
    data: {
      taxonomyId: string;
      name: string;
      slug: string;
      description?: string;
      parentId?: string;
    },
    subscriptionId: string
  ): Promise<Term> {
    return prisma.term.create({
      data: {
        ...data,
        subscriptionId,
        count: 0,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      parentId: string;
    }>,
    subscriptionId: string
  ): Promise<Term> {
    return prisma.term.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, subscriptionId: string): Promise<void> {
    await prisma.term.delete({
      where: { id },
    });
  }

  async incrementCount(id: string): Promise<void> {
    await prisma.term.update({
      where: { id },
      data: { count: { increment: 1 } },
    });
  }

  async decrementCount(id: string): Promise<void> {
    await prisma.term.update({
      where: { id },
      data: { count: { decrement: 1 } },
    });
  }
}

