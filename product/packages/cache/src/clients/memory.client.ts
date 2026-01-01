import { LRUCache } from 'lru-cache';
import { CacheClient } from '../types';

interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
}

export class MemoryCacheClient implements CacheClient {
  private cache: LRUCache<string, CacheEntry<unknown>>;
  private hits = 0;
  private misses = 0;

  constructor(options: { max: number; ttl: number }) {
    this.cache = new LRUCache<string, CacheEntry<unknown>>({
      max: options.max,
      ttl: options.ttl * 1000, // Convert to milliseconds
      updateAgeOnGet: true,
      updateAgeOnHas: true,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check manual expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      value,
      ...(ttl && { expiresAt: Date.now() + ttl * 1000 }),
    };

    this.cache.set(key, entry as CacheEntry<unknown>);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    return Promise.all(keys.map((key) => this.get<T>(key)));
  }

  async mset<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    for (const entry of entries) {
      await this.set(entry.key, entry.value, entry.ttl);
    }
  }

  async exists(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async ttl(key: string): Promise<number> {
    const entry = this.cache.get(key);
    if (!entry) return -2; // Key doesn't exist

    if (!entry.expiresAt) return -1; // No expiration

    const remaining = Math.floor((entry.expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  // Utility methods
  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getStats() {
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      maxSize: this.cache.max,
      hitRate: this.hits / (this.hits + this.misses || 1),
    };
  }

  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }
}

