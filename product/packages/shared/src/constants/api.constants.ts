export const API_ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
  
  // Posts
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts',
    GET: (id: string) => `/api/posts/${id}`,
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
    BULK_UPDATE: '/api/posts/bulk',
  },
  
  // Post Types
  POST_TYPES: {
    LIST: '/api/post-types',
    CREATE: '/api/post-types',
    GET: (id: string) => `/api/post-types/${id}`,
    UPDATE: (id: string) => `/api/post-types/${id}`,
    DELETE: (id: string) => `/api/post-types/${id}`,
  },
  
  // Media
  MEDIA: {
    LIST: '/api/media',
    UPLOAD: '/api/media/upload',
    GET: (id: string) => `/api/media/${id}`,
    UPDATE: (id: string) => `/api/media/${id}`,
    DELETE: (id: string) => `/api/media/${id}`,
    RESUMABLE_INIT: '/api/media/resumable/init',
    RESUMABLE_UPLOAD: (uploadId: string) => `/api/media/resumable/${uploadId}`,
    RESUMABLE_COMPLETE: (uploadId: string) => `/api/media/resumable/${uploadId}/complete`,
  },
  
  // Pages
  PAGES: {
    LIST: '/api/pages',
    CREATE: '/api/pages',
    GET: (id: string) => `/api/pages/${id}`,
    UPDATE: (id: string) => `/api/pages/${id}`,
    DELETE: (id: string) => `/api/pages/${id}`,
  },
  
  // Taxonomies
  TAXONOMIES: {
    LIST: '/api/taxonomies',
    CREATE: '/api/taxonomies',
    GET: (id: string) => `/api/taxonomies/${id}`,
    UPDATE: (id: string) => `/api/taxonomies/${id}`,
    DELETE: (id: string) => `/api/taxonomies/${id}`,
  },
  
  // Terms
  TERMS: {
    LIST: '/api/terms',
    CREATE: '/api/terms',
    GET: (id: string) => `/api/terms/${id}`,
    UPDATE: (id: string) => `/api/terms/${id}`,
    DELETE: (id: string) => `/api/terms/${id}`,
  },
  
  // Channels
  CHANNELS: {
    LIST: '/api/channels',
    CREATE: '/api/channels',
    GET: (id: string) => `/api/channels/${id}`,
    UPDATE: (id: string) => `/api/channels/${id}`,
    DELETE: (id: string) => `/api/channels/${id}`,
  },
  
  // Operations
  OPERATIONS: {
    LIST: '/api/operations',
    GET: (id: string) => `/api/operations/${id}`,
    CANCEL: (id: string) => `/api/operations/${id}/cancel`,
    RETRY: (id: string) => `/api/operations/${id}/retry`,
  },
} as const;

export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  SUBSCRIPTION_ID: 'X-Subscription-Id',
  SUBSCRIPTION_CODE: 'X-Subscription-Code',
  REQUEST_ID: 'X-Request-Id',
} as const;

