import { ElasticsearchService } from './elasticsearch.service';
import { CacheService } from '@cms/cache';
import { CACHE_TTL } from '@cms/shared';

export interface SearchOptions {
  query: string;
  filters?: Record<string, unknown>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class SearchService {
  constructor(
    private esService: ElasticsearchService,
    private cacheService?: CacheService
  ) {}

  async searchPosts<T>(
    subscriptionId: string,
    options: SearchOptions
  ): Promise<SearchResult<T>> {
    const { query, filters, page = 1, limit = 10, sortBy = 'publishedAt', sortOrder = 'desc' } = options;

    // Check cache first
    const cacheKey = this.generateCacheKey('posts', subscriptionId, options);
    if (this.cacheService) {
      const cached = await this.cacheService.get<SearchResult<T>>(cacheKey);
      if (cached) return cached;
    }

    // Build Elasticsearch query
    const esQuery: Record<string, unknown> = {
      bool: {
        must: [
          {
            match: {
              subscriptionId,
            },
          },
          {
            multi_match: {
              query,
              fields: ['title^3', 'excerpt^2', 'content'],
              type: 'best_fields',
              fuzziness: 'AUTO',
            },
          },
        ],
        filter: this.buildFilters(filters),
      },
    };

    const from = (page - 1) * limit;
    const sort = [{ [sortBy]: { order: sortOrder } }];

    const response = await this.esService.search<T>('posts', esQuery, {
      from,
      size: limit,
      sort,
    });

    const result: SearchResult<T> = {
      items: response.hits,
      total: response.total,
      page,
      limit,
      totalPages: Math.ceil(response.total / limit),
    };

    // Cache results
    if (this.cacheService) {
      await this.cacheService.set(cacheKey, result, { ttl: CACHE_TTL.FIVE_MINUTES });
    }

    return result;
  }

  async searchByType<T>(
    subscriptionId: string,
    postTypeId: string,
    options: Omit<SearchOptions, 'query'> & { query?: string }
  ): Promise<SearchResult<T>> {
    const { query, filters, page = 1, limit = 10, sortBy = 'publishedAt', sortOrder = 'desc' } = options;

    const cacheKey = this.generateCacheKey('posts-by-type', subscriptionId, options);
    if (this.cacheService) {
      const cached = await this.cacheService.get<SearchResult<T>>(cacheKey);
      if (cached) return cached;
    }

    const mustClauses: unknown[] = [
      { term: { subscriptionId } },
      { term: { postTypeId } },
      { term: { status: 'PUBLISHED' } },
    ];

    if (query) {
      mustClauses.push({
        multi_match: {
          query,
          fields: ['title^3', 'excerpt^2', 'content'],
        },
      });
    }

    const esQuery: Record<string, unknown> = {
      bool: {
        must: mustClauses,
        filter: this.buildFilters(filters),
      },
    };

    const from = (page - 1) * limit;
    const sort = [{ [sortBy]: { order: sortOrder } }];

    const response = await this.esService.search<T>('posts', esQuery, {
      from,
      size: limit,
      sort,
    });

    const result: SearchResult<T> = {
      items: response.hits,
      total: response.total,
      page,
      limit,
      totalPages: Math.ceil(response.total / limit),
    };

    if (this.cacheService) {
      await this.cacheService.set(cacheKey, result, { ttl: CACHE_TTL.FIVE_MINUTES });
    }

    return result;
  }

  async getTrending<T>(
    subscriptionId: string,
    postTypeId: string,
    limit = 10,
    timeRange = '7d'
  ): Promise<T[]> {
    const cacheKey = `trending:${subscriptionId}:${postTypeId}:${limit}:${timeRange}`;
    if (this.cacheService) {
      const cached = await this.cacheService.get<T[]>(cacheKey);
      if (cached) return cached;
    }

    // Aggregate by views in the time range
    const esQuery = {
      bool: {
        must: [
          { term: { subscriptionId } },
          { term: { postTypeId } },
          { term: { status: 'PUBLISHED' } },
          {
            range: {
              publishedAt: {
                gte: `now-${timeRange}`,
              },
            },
          },
        ],
      },
    };

    const response = await this.esService.search<T>('posts', esQuery, {
      size: limit,
      sort: [{ viewCount: { order: 'desc' } }, { publishedAt: { order: 'desc' } }],
    });

    const results = response.hits;

    if (this.cacheService) {
      await this.cacheService.set(cacheKey, results, { ttl: CACHE_TTL.TEN_MINUTES });
    }

    return results;
  }

  private buildFilters(filters?: Record<string, unknown>): unknown[] {
    if (!filters) return [];

    return Object.entries(filters).map(([key, value]) => {
      if (Array.isArray(value)) {
        return { terms: { [key]: value } };
      }
      return { term: { [key]: value } };
    });
  }

  private generateCacheKey(prefix: string, subscriptionId: string, options: unknown): string {
    const optionsStr = JSON.stringify(options);
    return `${prefix}:${subscriptionId}:${this.hashString(optionsStr)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

