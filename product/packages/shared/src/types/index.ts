// Common types used across the application
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: IApiError;
  meta?: PaginationMeta;
}

export interface IApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface SubscriptionContext {
  subscriptionId: string;
  subscriptionCode: string;
  hosts: string[];
  userId?: string;
  userRole?: string;
}

