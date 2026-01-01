export enum WidgetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export enum WidgetPlatform {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  AMP = 'AMP',
  ALL = 'ALL',
}

export interface Widget {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: WidgetStatus;
  dataSource: WidgetDataSourceConfig;
  viewOptions: WidgetViewOptions;
  platform: WidgetPlatform;
  target?: string;
  structure: WidgetStructure;
  cacheDuration?: number; // seconds
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WidgetDataSourceConfig {
  type: 'query' | 'static' | 'api' | 'computed';
  postTypeId?: string;
  query?: {
    limit?: number;
    offset?: number;
    orderBy?: { field: string; direction: 'asc' | 'desc' }[];
    filters?: Record<string, unknown>;
    include?: string[];
  };
  staticData?: unknown;
  apiEndpoint?: string;
  computeFunction?: string;
}

export interface WidgetViewOptions {
  layout: 'grid' | 'list' | 'carousel' | 'masonry' | 'custom';
  columns?: number;
  showTitle?: boolean;
  showExcerpt?: boolean;
  showDate?: boolean;
  showAuthor?: boolean;
  showThumbnail?: boolean;
  thumbnailSize?: string;
  dateFormat?: string;
  linkTarget?: '_self' | '_blank';
  customClass?: string;
  customStyles?: Record<string, unknown>;
}

export interface WidgetStructure {
  component: string;
  props?: Record<string, unknown>;
  slots?: Record<string, WidgetStructure>;
  children?: WidgetStructure[];
}

