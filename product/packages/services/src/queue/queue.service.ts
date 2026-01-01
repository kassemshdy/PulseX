import { Queue, Worker, Job, QueueOptions } from 'bullmq';
import { Redis } from 'ioredis';
import { OperationType, OperationStatus, OperationPriority } from '@cms/shared';

export interface QueueJobData {
  operationId: string;
  type: OperationType;
  priority: OperationPriority;
  payload: Record<string, unknown>;
}

export class QueueService {
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private connection: Redis;

  constructor(redisConfig: { host: string; port: number; password?: string }) {
    this.connection = new Redis(redisConfig);
  }

  createQueue(name: string, options?: QueueOptions): Queue {
    if (this.queues.has(name)) {
      return this.queues.get(name)!;
    }

    const queue = new Queue(name, {
      connection: this.connection,
      ...options,
    });

    this.queues.set(name, queue);
    return queue;
  }

  async addJob(
    queueName: string,
    data: QueueJobData,
    options?: {
      priority?: number;
      delay?: number;
      attempts?: number;
    }
  ): Promise<Job> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    return queue.add(data.type, data, {
      priority: this.getPriorityValue(data.priority),
      delay: options?.delay,
      attempts: options?.attempts || 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  createWorker(
    queueName: string,
    processor: (job: Job) => Promise<void>
  ): Worker {
    if (this.workers.has(queueName)) {
      return this.workers.get(queueName)!;
    }

    const worker = new Worker(queueName, processor, {
      connection: this.connection,
      concurrency: 5,
    });

    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed:`, err);
    });

    this.workers.set(queueName, worker);
    return worker;
  }

  async closeAll(): Promise<void> {
    await Promise.all([
      ...Array.from(this.queues.values()).map((q) => q.close()),
      ...Array.from(this.workers.values()).map((w) => w.close()),
    ]);
    await this.connection.quit();
  }

  private getPriorityValue(priority: OperationPriority): number {
    const priorityMap = {
      [OperationPriority.CRITICAL]: 1,
      [OperationPriority.HIGH]: 2,
      [OperationPriority.NORMAL]: 3,
      [OperationPriority.LOW]: 4,
    };
    return priorityMap[priority];
  }
}

