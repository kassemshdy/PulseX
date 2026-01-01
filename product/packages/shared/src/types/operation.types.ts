export enum OperationType {
  VIDEO_UPLOAD = 'VIDEO_UPLOAD',
  VIDEO_TRANSCODE = 'VIDEO_TRANSCODE',
  IMAGE_PROCESS = 'IMAGE_PROCESS',
  SOCIAL_PUBLISH = 'SOCIAL_PUBLISH',
  NOTIFICATION_SEND = 'NOTIFICATION_SEND',
  CONTENT_INDEX = 'CONTENT_INDEX',
  CACHE_WARM = 'CACHE_WARM',
  EXPORT_DATA = 'EXPORT_DATA',
  IMPORT_DATA = 'IMPORT_DATA',
}

export enum OperationStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RETRYING = 'RETRYING',
}

export enum OperationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Operation {
  id: string;
  type: OperationType;
  status: OperationStatus;
  priority: OperationPriority;
  resourceId?: string;
  resourceType?: string;
  progress: number; // 0-100
  currentState?: string;
  parameters?: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: OperationError;
  logs: OperationLog[];
  retryCount: number;
  maxRetries: number;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
  subscriptionId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OperationError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export interface OperationLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: Record<string, unknown>;
}

