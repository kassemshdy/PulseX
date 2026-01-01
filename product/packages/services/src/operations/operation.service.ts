import { prisma, Operation, OperationType, OperationStatus, OperationPriority } from '@cms/database';

export class OperationService {
  async findById(id: string, subscriptionId: string): Promise<Operation | null> {
    return prisma.operation.findFirst({
      where: { id, subscriptionId },
    });
  }

  async findAll(subscriptionId: string, options?: {
    type?: OperationType;
    status?: OperationStatus;
    resourceId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Operation[]; total: number }> {
    const { type, status, resourceId, page = 1, limit = 20 } = options || {};

    const where = {
      subscriptionId,
      ...(type && { type }),
      ...(status && { status }),
      ...(resourceId && { resourceId }),
    };

    const [items, total] = await Promise.all([
      prisma.operation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.operation.count({ where }),
    ]);

    return { items, total };
  }

  async create(
    data: {
      type: OperationType;
      priority?: OperationPriority;
      resourceId?: string;
      resourceType?: string;
      parameters?: Record<string, unknown>;
    },
    createdById: string,
    subscriptionId: string
  ): Promise<Operation> {
    return prisma.operation.create({
      data: {
        ...data,
        priority: data.priority || OperationPriority.NORMAL,
        status: OperationStatus.PENDING,
        progress: 0,
        logs: [],
        retryCount: 0,
        maxRetries: 3,
        createdById,
        subscriptionId,
      },
    });
  }

  async updateProgress(
    id: string,
    progress: number,
    currentState?: string
  ): Promise<Operation> {
    return prisma.operation.update({
      where: { id },
      data: {
        progress,
        currentState,
        ...(progress === 0 && { startedAt: new Date() }),
      },
    });
  }

  async updateStatus(
    id: string,
    status: OperationStatus,
    result?: Record<string, unknown>,
    error?: Record<string, unknown>
  ): Promise<Operation> {
    return prisma.operation.update({
      where: { id },
      data: {
        status,
        ...(result && { result }),
        ...(error && { error }),
        ...(status === OperationStatus.COMPLETED || status === OperationStatus.FAILED
          ? { completedAt: new Date() }
          : {}),
      },
    });
  }

  async addLog(
    id: string,
    log: {
      level: 'info' | 'warn' | 'error' | 'debug';
      message: string;
      data?: Record<string, unknown>;
    }
  ): Promise<void> {
    const operation = await prisma.operation.findUnique({
      where: { id },
    });

    if (!operation) return;

    const logs = operation.logs as unknown[];
    logs.push({
      timestamp: new Date(),
      ...log,
    });

    await prisma.operation.update({
      where: { id },
      data: { logs },
    });
  }

  async cancel(id: string, subscriptionId: string): Promise<Operation> {
    return prisma.operation.update({
      where: { id },
      data: {
        status: OperationStatus.CANCELLED,
        completedAt: new Date(),
      },
    });
  }

  async retry(id: string, subscriptionId: string): Promise<Operation> {
    return prisma.operation.update({
      where: { id },
      data: {
        status: OperationStatus.RETRYING,
        retryCount: { increment: 1 },
      },
    });
  }
}

