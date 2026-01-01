import { MemoryCacheClient } from '../clients/memory.client';
import { RedisCacheClient } from '../clients/redis.client';
import { CacheOptions, CacheStats, CacheInvalidationListener } from '../types';

export class CacheService {
  private l1Cache: MemoryCacheClient;
  private l2Cache?: RedisCacheClient;
  private invalidationListeners: CacheInvalidationListener[] = [];

  constructor(
    l1Config: { max: number; ttl: number },
    l2Config?: { host: string; port: number; password?: string; keyPrefix?: string }
  ) {
    this.l1Cache = new MemoryCacheClient(l1Config);

    if (l2Config) {
      this.l2Cache = new RedisCacheClient(l2Config);

      // Subscribe to invalidation events
      this.l2Cache.subscribe('invalidate', (pattern) => {
        this.handleInvalidation(pattern);
      });
    }
  }

  /**
   * Get value from cache (tries L1 then L2)
   */
  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    // L1 only
    if (options?.l1Only || !this.l2Cache) {
      return this.l1Cache.get<T>(key);
    }

    // L2 only
    if (options?.l2Only) {
      return this.l2Cache.get<T>(key);
    }

    // Try L1 first
    const l1Value = await this.l1Cache.get<T>(key);
    if (l1Value !== null) {
      return l1Value;
    }

    // Try L2
    if (this.l2Cache) {
      const l2Value = await this.l2Cache.get<T>(key);
      if (l2Value !== null) {
        // Warm L1 cache
        await this.l1Cache.set(key, l2Value, options?.ttl);
        return l2Value;
      }
    }

    return null;
  }

  /**
   * Set value in cache (sets in both L1 and L2)
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttl;

    // Set in L1
    if (!options?.l2Only) {
      await this.l1Cache.set(key, value, ttl);
    }

    // Set in L2
    if (this.l2Cache && !options?.l1Only) {
      await this.l2Cache.set(key, value, ttl);
    }
  }

  /**
   * Get value from cache or compute it
   */
  async getOrCompute<T>(
    key: string,
    compute: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    // Check if refresh is forced
    if (options?.refresh) {
      const value = await compute();
      await this.set(key, value, options);
      return value;
    }

    // Try to get from cache
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    // Compute and cache
    const value = await compute();
    await this.set(key, value, options);
    return value;
  }

  /**
   * Delete key from cache
   */
  async delete(key: string, options?: CacheOptions): Promise<void> {
    // Delete from L1
    if (!options?.l2Only) {
      await this.l1Cache.delete(key);
    }

    // Delete from L2 and publish invalidation
    if (this.l2Cache && !options?.l1Only) {
      await this.l2Cache.delete(key);
      await this.l2Cache.publish('invalidate', key);
    }
  }

  /**
   * Delete keys matching pattern
   */
  async deletePattern(pattern: string, options?: CacheOptions): Promise<void> {
    // Delete from L1
    if (!options?.l2Only) {
      await this.l1Cache.deletePattern(pattern);
    }

    // Delete from L2 and publish invalidation
    if (this.l2Cache && !options?.l1Only) {
      await this.l2Cache.deletePattern(pattern);
      await this.l2Cache.publish('invalidate', pattern);
    }
  }

  /**
   * Get multiple keys
   */
  async mget<T>(keys: string[], options?: CacheOptions): Promise<(T | null)[]> {
    if (options?.l2Only && this.l2Cache) {
      return this.l2Cache.mget<T>(keys);
    }

    if (options?.l1Only || !this.l2Cache) {
      return this.l1Cache.mget<T>(keys);
    }

    // Try L1 first
    const l1Results = await this.l1Cache.mget<T>(keys);
    const missingKeys: string[] = [];
    const missingIndices: number[] = [];

    l1Results.forEach((value, index) => {
      if (value === null) {
        missingKeys.push(keys[index]!);
        missingIndices.push(index);
      }
    });

    // If all found in L1, return
    if (missingKeys.length === 0) {
      return l1Results;
    }

    // Try L2 for missing keys
    if (this.l2Cache) {
      const l2Results = await this.l2Cache.mget<T>(missingKeys);

      // Warm L1 cache and merge results
      const warmEntries: Array<{ key: string; value: T; ttl?: number }> = [];

      l2Results.forEach((value, i) => {
        if (value !== null) {
          const originalIndex = missingIndices[i]!;
          l1Results[originalIndex] = value;
          warmEntries.push({ key: missingKeys[i]!, value, ttl: options?.ttl });
        }
      });

      if (warmEntries.length > 0) {
        await this.l1Cache.mset(warmEntries);
      }
    }

    return l1Results;
  }

  /**
   * Check if key exists
   */
  async exists(key: string, options?: CacheOptions): Promise<boolean> {
    if (options?.l2Only && this.l2Cache) {
      return this.l2Cache.exists(key);
    }

    if (options?.l1Only || !this.l2Cache) {
      return this.l1Cache.exists(key);
    }

    // Check L1 first
    const l1Exists = await this.l1Cache.exists(key);
    if (l1Exists) return true;

    // Check L2
    return this.l2Cache ? this.l2Cache.exists(key) : false;
  }

  /**
   * Get TTL for key
   */
  async ttl(key: string, options?: CacheOptions): Promise<number> {
    if (options?.l2Only && this.l2Cache) {
      return this.l2Cache.ttl(key);
    }

    if (options?.l1Only || !this.l2Cache) {
      return this.l1Cache.ttl(key);
    }

    // Check L1 first
    const l1Ttl = await this.l1Cache.ttl(key);
    if (l1Ttl >= 0) return l1Ttl;

    // Check L2
    return this.l2Cache ? this.l2Cache.ttl(key) : -2;
  }

  /**
   * Register invalidation listener
   */
  onInvalidation(listener: CacheInvalidationListener): void {
    this.invalidationListeners.push(listener);
  }

  /**
   * Handle cache invalidation
   */
  private async handleInvalidation(pattern: string): Promise<void> {
    // Delete from L1
    await this.l1Cache.deletePattern(pattern);

    // Notify listeners
    for (const listener of this.invalidationListeners) {
      try {
        await listener(pattern);
      } catch (error) {
        console.error('Invalidation listener error:', error);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const l1Stats = this.l1Cache.getStats();
    const l2Stats = this.l2Cache?.getStats();

    return {
      l1: {
        hits: l1Stats.hits,
        misses: l1Stats.misses,
        size: l1Stats.size,
        maxSize: l1Stats.maxSize,
      },
      l2: {
        hits: l2Stats?.hits || 0,
        misses: l2Stats?.misses || 0,
      },
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.l1Cache.resetStats();
    this.l2Cache?.resetStats();
  }

  /**
   * Clear all caches
   */
  async clear(): Promise<void> {
    this.l1Cache.clear();
    if (this.l2Cache) {
      await this.l2Cache.flush();
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.l2Cache) {
      await this.l2Cache.disconnect();
    }
  }
}

