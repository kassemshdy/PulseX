export interface CacheClient {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
  mget<T>(keys: string[]): Promise<(T | null)[]>;
  mset<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void>;
  exists(key: string): Promise<boolean>;
  ttl(key: string): Promise<number>;
}

export interface CacheConfig {
  memory?: {
    max: number; // Max number of items
    ttl: number; // Default TTL in seconds
  };
  redis?: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
  };
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  refresh?: boolean; // Force refresh from source
  l1Only?: boolean; // Only use L1 cache (memory)
  l2Only?: boolean; // Only use L2 cache (Redis)
}

export interface CacheStats {
  l1: {
    hits: number;
    misses: number;
    size: number;
    maxSize: number;
  };
  l2: {
    hits: number;
    misses: number;
  };
}

export type CacheInvalidationListener = (pattern: string) => void | Promise<void>;

