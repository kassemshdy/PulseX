import { Client, ClientOptions } from '@elastic/elasticsearch';
import { ERROR_CODES, createApiError } from '@cms/shared';

export class ElasticsearchService {
  private client: Client;
  private indexPrefix: string;

  constructor(options: ClientOptions & { indexPrefix?: string }) {
    this.client = new Client(options);
    this.indexPrefix = options.indexPrefix || 'cms_';
  }

  async ping(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  async createIndex(name: string, mappings: Record<string, unknown>): Promise<void> {
    const indexName = this.getIndexName(name);

    try {
      const exists = await this.client.indices.exists({ index: indexName });

      if (!exists) {
        await this.client.indices.create({
          index: indexName,
          body: {
            mappings,
          },
        });
      }
    } catch (error) {
      console.error('Create index error:', error);
      throw createApiError(ERROR_CODES.ELASTICSEARCH_ERROR, 'Failed to create index');
    }
  }

  async indexDocument(
    index: string,
    id: string,
    document: Record<string, unknown>
  ): Promise<void> {
    const indexName = this.getIndexName(index);

    try {
      await this.client.index({
        index: indexName,
        id,
        document,
        refresh: 'wait_for',
      });
    } catch (error) {
      console.error('Index document error:', error);
      throw createApiError(ERROR_CODES.ELASTICSEARCH_ERROR, 'Failed to index document');
    }
  }

  async bulkIndex(
    index: string,
    documents: Array<{ id: string; document: Record<string, unknown> }>
  ): Promise<void> {
    const indexName = this.getIndexName(index);

    try {
      const body = documents.flatMap((doc) => [
        { index: { _index: indexName, _id: doc.id } },
        doc.document,
      ]);

      await this.client.bulk({
        body,
        refresh: 'wait_for',
      });
    } catch (error) {
      console.error('Bulk index error:', error);
      throw createApiError(ERROR_CODES.ELASTICSEARCH_ERROR, 'Failed to bulk index documents');
    }
  }

  async updateDocument(
    index: string,
    id: string,
    document: Record<string, unknown>
  ): Promise<void> {
    const indexName = this.getIndexName(index);

    try {
      await this.client.update({
        index: indexName,
        id,
        doc: document,
        refresh: 'wait_for',
      });
    } catch (error) {
      console.error('Update document error:', error);
      throw createApiError(ERROR_CODES.ELASTICSEARCH_ERROR, 'Failed to update document');
    }
  }

  async deleteDocument(index: string, id: string): Promise<void> {
    const indexName = this.getIndexName(index);

    try {
      await this.client.delete({
        index: indexName,
        id,
        refresh: 'wait_for',
      });
    } catch (error) {
      console.error('Delete document error:', error);
    }
  }

  async getDocument<T>(index: string, id: string): Promise<T | null> {
    const indexName = this.getIndexName(index);

    try {
      const response = await this.client.get({
        index: indexName,
        id,
      });

      return response._source as T;
    } catch (error) {
      return null;
    }
  }

  async search<T>(
    index: string,
    query: Record<string, unknown>,
    options?: {
      from?: number;
      size?: number;
      sort?: unknown[];
    }
  ): Promise<{ total: number; hits: T[] }> {
    const indexName = this.getIndexName(index);

    try {
      const response = await this.client.search({
        index: indexName,
        body: {
          query,
          from: options?.from || 0,
          size: options?.size || 10,
          ...(options?.sort && { sort: options.sort }),
        },
      });

      return {
        total: typeof response.hits.total === 'number' 
          ? response.hits.total 
          : response.hits.total?.value || 0,
        hits: response.hits.hits.map((hit) => hit._source as T),
      };
    } catch (error) {
      console.error('Search error:', error);
      throw createApiError(ERROR_CODES.ELASTICSEARCH_ERROR, 'Search failed');
    }
  }

  async aggregateSearch<T>(
    index: string,
    query: Record<string, unknown>,
    aggregations: Record<string, unknown>
  ): Promise<{ total: number; hits: T[]; aggregations: Record<string, unknown> }> {
    const indexName = this.getIndexName(index);

    try {
      const response = await this.client.search({
        index: indexName,
        body: {
          query,
          aggs: aggregations,
        },
      });

      return {
        total: typeof response.hits.total === 'number' 
          ? response.hits.total 
          : response.hits.total?.value || 0,
        hits: response.hits.hits.map((hit) => hit._source as T),
        aggregations: response.aggregations as Record<string, unknown>,
      };
    } catch (error) {
      console.error('Aggregate search error:', error);
      throw createApiError(ERROR_CODES.ELASTICSEARCH_ERROR, 'Aggregate search failed');
    }
  }

  async deleteIndex(name: string): Promise<void> {
    const indexName = this.getIndexName(name);

    try {
      await this.client.indices.delete({ index: indexName });
    } catch (error) {
      console.error('Delete index error:', error);
    }
  }

  private getIndexName(name: string): string {
    return `${this.indexPrefix}${name}`;
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}

