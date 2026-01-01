export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED',
  TRASH = 'TRASH',
}

export enum RelationType {
  ONE_TO_ONE = 'ONE_TO_ONE',
  ONE_TO_MANY = 'ONE_TO_MANY',
  MANY_TO_MANY = 'MANY_TO_MANY',
}

export interface PostType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  fields: PostTypeField[];
  supportedMedia: string[];
  isActive: boolean;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostTypeField {
  key: string;
  label: string;
  type: string; // text, textarea, number, boolean, date, select, multiselect, etc.
  required: boolean;
  defaultValue?: unknown;
  validation?: Record<string, unknown>;
  options?: Array<{ label: string; value: string }>;
}

export interface Post {
  id: string;
  postTypeId: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  status: PostStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ogImage?: string;
  publishedAt?: Date;
  scheduledFor?: Date;
  createdById: string;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostMeta {
  id: string;
  postId: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostRelation {
  id: string;
  sourcePostId: string;
  targetPostId: string;
  relationType: string;
  order?: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface PostTypeRelation {
  id: string;
  sourcePostTypeId: string;
  targetPostTypeId: string;
  name: string;
  relationType: RelationType;
  required: boolean;
  multiple: boolean;
  createdAt: Date;
}

