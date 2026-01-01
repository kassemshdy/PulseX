export enum SocialPlatform {
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
  TELEGRAM = 'TELEGRAM',
  LINKEDIN = 'LINKEDIN',
}

export enum ChannelStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  ERROR = 'ERROR',
}

export enum PublishStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface Channel {
  id: string;
  name: string;
  platform: SocialPlatform;
  platformAccountId: string;
  accountHandle: string;
  credentials: Record<string, unknown>;
  status: ChannelStatus;
  metadata?: Record<string, unknown>;
  groupName?: string;
  lastSyncAt?: Date;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublishedPost {
  id: string;
  contentId: string;
  channelId: string;
  platformPostId: string;
  contentSnapshot: Record<string, unknown>;
  publishedAt: Date;
  status: PublishStatus;
  metrics?: SocialMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMetrics {
  likes?: number;
  shares?: number;
  comments?: number;
  views?: number;
  clicks?: number;
  reach?: number;
  engagement?: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  triggers: AutomationTrigger[];
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
  schedule?: CronSchedule;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationTrigger {
  type: string; // post_published, post_updated, scheduled_time
  config: Record<string, unknown>;
}

export interface AutomationCondition {
  field: string;
  operator: string;
  value: unknown;
}

export interface AutomationAction {
  type: string; // publish_to_social, send_notification, webhook
  config: Record<string, unknown>;
}

export interface CronSchedule {
  expression: string;
  timezone?: string;
}

export interface NotificationTopic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subscriberCount: number;
  conditions?: Record<string, unknown>;
  template?: NotificationTemplate;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  data?: Record<string, unknown>;
}

