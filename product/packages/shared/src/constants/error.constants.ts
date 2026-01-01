export const ERROR_CODES = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource Errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  GONE: 'GONE',
  
  // Server Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  ELASTICSEARCH_ERROR: 'ELASTICSEARCH_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  
  // Business Logic
  OPERATION_FAILED: 'OPERATION_FAILED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Media & Upload
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR',
  
  // External Services
  SOCIAL_PLATFORM_ERROR: 'SOCIAL_PLATFORM_ERROR',
  NOTIFICATION_ERROR: 'NOTIFICATION_ERROR',
  THIRD_PARTY_ERROR: 'THIRD_PARTY_ERROR',
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.UNAUTHORIZED]: 'Authentication required',
  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to perform this action',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid email or password',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please login again',
  [ERROR_CODES.TOKEN_INVALID]: 'Invalid authentication token',
  
  [ERROR_CODES.VALIDATION_ERROR]: 'Validation failed',
  [ERROR_CODES.INVALID_INPUT]: 'Invalid input provided',
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Required field is missing',
  
  [ERROR_CODES.NOT_FOUND]: 'Resource not found',
  [ERROR_CODES.ALREADY_EXISTS]: 'Resource already exists',
  [ERROR_CODES.CONFLICT]: 'Resource conflict',
  [ERROR_CODES.GONE]: 'Resource is no longer available',
  
  [ERROR_CODES.INTERNAL_ERROR]: 'An internal error occurred',
  [ERROR_CODES.DATABASE_ERROR]: 'Database operation failed',
  [ERROR_CODES.ELASTICSEARCH_ERROR]: 'Search service error',
  [ERROR_CODES.CACHE_ERROR]: 'Cache operation failed',
  
  [ERROR_CODES.OPERATION_FAILED]: 'Operation failed',
  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
  [ERROR_CODES.QUOTA_EXCEEDED]: 'Quota exceeded',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later',
  
  [ERROR_CODES.FILE_TOO_LARGE]: 'File size exceeds maximum allowed',
  [ERROR_CODES.INVALID_FILE_TYPE]: 'File type not supported',
  [ERROR_CODES.UPLOAD_FAILED]: 'File upload failed',
  [ERROR_CODES.STORAGE_ERROR]: 'Storage service error',
  
  [ERROR_CODES.SOCIAL_PLATFORM_ERROR]: 'Social media platform error',
  [ERROR_CODES.NOTIFICATION_ERROR]: 'Notification service error',
  [ERROR_CODES.THIRD_PARTY_ERROR]: 'Third-party service error',
};

