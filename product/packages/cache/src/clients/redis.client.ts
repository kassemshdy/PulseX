import Redis, { RedisOptions } from 'ioredis';
import { CacheClient } from '../types';

export class RedisCacheClient implements CacheClient {
  private client: Redis;
  private pubClient: Redis;
  private subClient: Redis;
  private hits = 0;
  private misses = 0;
  private keyPrefix: string;

  constructor(options: RedisOptions & { keyPrefix?: string }) {
    this.keyPrefix = options.keyPrefix || 'cms:';
    
    this.client = new Redis({
      ...options,
      keyPrefix: this.keyPrefix,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    // Separate clients for pub/sub (ioredis requirement)
    this.pubClient = this.client.duplicate();
    this.subClient = this.client.duplicate();

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.pubClient.on('error', (err) => {
      console.error('Redis Pub Client Error:', err);
    });

    this.subClient.on('error', (err) => {
      console.error('Redis Sub Client Error:', err);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);

      if (value === null) {
        this.misses++;
        return null;
      }

      this.hits++;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);

      if (ttl) {
        await this.client.setex(key, ttl, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      const stream = this.client.scanStream({
        match: pattern,
        count: 100,
      });

      const pipeline = this.client.pipeline();
      let count = 0;

      stream.on('data', (keys: string[]) => {
        for (const key of keys) {
          pipeline.del(key);
          count++;

          // Execute pipeline in batches of 100
          if (count % 100 === 0) {
            pipeline.exec();
          }
        }
      });

      await new Promise<void>((resolve, reject) => {
        stream.on('end', async () => {
          if (count % 100 !== 0) {
            await pipeline.exec();
          }
          resolve();
        });
        stream.on('error', reject);
      });
    } catch (error) {
      console.error('Redis deletePattern error:', error);
    }
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      if (keys.length === 0) return [];

      const values = await this.client.mget(...keys);

      return values.map((value) => {
        if (value === null) {
          this.misses++;
          return null;
        }

        this.hits++;
        return JSON.parse(value) as T;
      });
    } catch (error) {
      console.error('Redis mget error:', error);
      return keys.map(() => null);
    }
  }

  async mset<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    try {
      const pipeline = this.client.pipeline();

      for (const entry of entries) {
        const serialized = JSON.stringify(entry.value);

        if (entry.ttl) {
          pipeline.setex(entry.key, entry.ttl, serialized);
        } else {
          pipeline.set(entry.key, serialized);
        }
      }

      await pipeline.exec();
    } catch (error) {
      console.error('Redis mset error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Redis ttl error:', error);
      return -2;
    }
  }

  // Pub/Sub methods for cache invalidation
  async publish(channel: string, message: string): Promise<void> {
    try {
      await this.pubClient.publish(`${this.keyPrefix}${channel}`, message);
    } catch (error) {
      console.error('Redis publish error:', error);
    }
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    try {
      await this.subClient.subscribe(`${this.keyPrefix}${channel}`);

      this.subClient.on('message', (ch, message) => {
        if (ch === `${this.keyPrefix}${channel}`) {
          callback(message);
        }
      });
    } catch (error) {
      console.error('Redis subscribe error:', error);
    }
  }

  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.subClient.unsubscribe(`${this.keyPrefix}${channel}`);
    } catch (error) {
      console.error('Redis unsubscribe error:', error);
    }
  }

  // Utility methods
  async ping(): Promise<boolean> {
    try {
      const response = await this.client.ping();
      return response === 'PONG';
    } catch {
      return false;
    }
  }

  async flush(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (error) {
      console.error('Redis flush error:', error);
    }
  }

  getStats() {
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits / (this.hits + this.misses || 1),
    };
  }

  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }

  async disconnect(): Promise<void> {
    await Promise.all([
      this.client.quit(),
      this.pubClient.quit(),
      this.subClient.quit(),
    ]);
  }
}

