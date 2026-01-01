export enum PageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  layout: PageLayout;
  theme?: Record<string, unknown>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ogImage?: string;
  templateId?: string;
  createdById: string;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageLayout {
  sections: PageSection[];
  settings?: Record<string, unknown>;
}

export interface PageSection {
  id: string;
  type: string;
  widgetId?: string;
  dataSource?: WidgetDataSource;
  settings: Record<string, unknown>;
  children?: PageSection[];
}

export interface WidgetDataSource {
  type: 'static' | 'dynamic' | 'query';
  postTypeId?: string;
  query?: WidgetQuery;
  staticData?: unknown;
}

export interface WidgetQuery {
  limit?: number;
  offset?: number;
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  filters?: Record<string, unknown>;
  include?: string[];
}

export interface PageView {
  id: string;
  entityType: string; // page, post, term
  entityId: string;
  entitySlug: string;
  userId?: string;
  sessionId: string;
  ip: string;
  userAgent: string;
  referrer?: string;
  country?: string;
  duration?: number;
  viewedAt: Date;
}

export interface Link {
  id: string;
  publicLink: string;
  shortlink?: string;
  resourceId: string;
  resourceType: string; // post, term, page, posttype
  redirectTo?: string;
  ampLink?: string;
  canonical?: string;
  cachingDuration?: number;
  domains?: string[];
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

