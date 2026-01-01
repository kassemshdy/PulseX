import { CacheService } from '../services/cache.service';
import { CACHE_TTL } from '@cms/shared';

export class WidgetCacheManager {
  constructor(private cacheService: CacheService) {
    // Listen for invalidation events
    this.cacheService.onInvalidation((pattern) => {
      console.log(`Widget cache invalidated: ${pattern}`);
    });
  }

  /**
   * Get widget data by ID and subscription
   */
  async getWidget<T>(
    widgetId: string,
    subscriptionId: string,
    options?: { refresh?: boolean }
  ): Promise<T | null> {
    const key = this.generateKey('widget', widgetId, subscriptionId);
    return this.cacheService.get<T>(key, { ...options, ttl: CACHE_TTL.ONE_HOUR });
  }

  /**
   * Set widget data
   */
  async setWidget<T>(widgetId: string, subscriptionId: string, data: T): Promise<void> {
    const key = this.generateKey('widget', widgetId, subscriptionId);
    await this.cacheService.set(key, data, { ttl: CACHE_TTL.ONE_HOUR });
  }

  /**
   * Get widget result (computed data)
   */
  async getWidgetResult<T>(
    widgetId: string,
    subscriptionId: string,
    params: Record<string, unknown>,
    compute: () => Promise<T>,
    options?: { refresh?: boolean; ttl?: number }
  ): Promise<T> {
    const key = this.generateResultKey(widgetId, subscriptionId, params);
    const ttl = options?.ttl || CACHE_TTL.TEN_MINUTES;

    return this.cacheService.getOrCompute(key, compute, { ...options, ttl });
  }

  /**
   * Get trending content (page views based)
   */
  async getTrending<T>(
    postTypeId: string,
    subscriptionId: string,
    limit: number,
    compute: () => Promise<T[]>
  ): Promise<T[]> {
    const key = this.generateKey('trending', postTypeId, subscriptionId, limit.toString());
    return this.cacheService.getOrCompute(key, compute, { ttl: CACHE_TTL.FIVE_MINUTES });
  }

  /**
   * Get latest content
   */
  async getLatest<T>(
    postTypeId: string,
    subscriptionId: string,
    limit: number,
    compute: () => Promise<T[]>
  ): Promise<T[]> {
    const key = this.generateKey('latest', postTypeId, subscriptionId, limit.toString());
    return this.cacheService.getOrCompute(key, compute, { ttl: CACHE_TTL.FIVE_MINUTES });
  }

  /**
   * Get page configuration
   */
  async getPageConfig<T>(
    pageId: string,
    subscriptionId: string,
    compute: () => Promise<T>
  ): Promise<T> {
    const key = this.generateKey('page-config', pageId, subscriptionId);
    return this.cacheService.getOrCompute(key, compute, { ttl: CACHE_TTL.ONE_HOUR });
  }

  /**
   * Get theme configuration
   */
  async getThemeConfig<T>(
    themeId: string,
    subscriptionId: string,
    compute: () => Promise<T>
  ): Promise<T> {
    const key = this.generateKey('theme-config', themeId, subscriptionId);
    return this.cacheService.getOrCompute(key, compute, { ttl: CACHE_TTL.SIX_HOURS });
  }

  /**
   * Invalidate widget cache
   */
  async invalidateWidget(widgetId: string, subscriptionId: string): Promise<void> {
    const pattern = this.generateKey('widget', widgetId, subscriptionId) + '*';
    await this.cacheService.deletePattern(pattern);
  }

  /**
   * Invalidate all widgets for a post type
   */
  async invalidatePostType(postTypeId: string, subscriptionId: string): Promise<void> {
    const patterns = [
      this.generateKey('trending', postTypeId, subscriptionId) + '*',
      this.generateKey('latest', postTypeId, subscriptionId) + '*',
    ];

    await Promise.all(patterns.map((pattern) => this.cacheService.deletePattern(pattern)));
  }

  /**
   * Invalidate page cache
   */
  async invalidatePage(pageId: string, subscriptionId: string): Promise<void> {
    const pattern = this.generateKey('page-config', pageId, subscriptionId) + '*';
    await this.cacheService.deletePattern(pattern);
  }

  /**
   * Invalidate theme cache
   */
  async invalidateTheme(themeId: string, subscriptionId: string): Promise<void> {
    const pattern = this.generateKey('theme-config', themeId, subscriptionId) + '*';
    await this.cacheService.deletePattern(pattern);
  }

  /**
   * Invalidate all cache for a subscription
   */
  async invalidateSubscription(subscriptionId: string): Promise<void> {
    const pattern = `*:${subscriptionId}:*`;
    await this.cacheService.deletePattern(pattern);
  }

  /**
   * Warm cache for popular widgets
   */
  async warmCache(
    widgets: Array<{ id: string; subscriptionId: string; compute: () => Promise<unknown> }>
  ): Promise<void> {
    await Promise.all(
      widgets.map(async (widget) => {
        const key = this.generateKey('widget', widget.id, widget.subscriptionId);
        const data = await widget.compute();
        await this.cacheService.set(key, data, { ttl: CACHE_TTL.ONE_HOUR });
      })
    );
  }

  /**
   * Generate cache key
   */
  private generateKey(...parts: string[]): string {
    return parts.join(':');
  }

  /**
   * Generate result key with hashed params
   */
  private generateResultKey(
    widgetId: string,
    subscriptionId: string,
    params: Record<string, unknown>
  ): string {
    const paramsHash = this.hashObject(params);
    return this.generateKey('widget-result', widgetId, subscriptionId, paramsHash);
  }

  /**
   * Simple hash function for objects
   */
  private hashObject(obj: Record<string, unknown>): string {
    const str = JSON.stringify(obj);
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
  }
}

