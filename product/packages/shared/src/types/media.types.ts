export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

export enum MediaRelationType {
  FEATURED = 'FEATURED',
  GALLERY = 'GALLERY',
  THUMBNAIL = 'THUMBNAIL',
  ATTACHMENT = 'ATTACHMENT',
  INLINE = 'INLINE',
}

export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  type: MediaType;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  path: string;
  cdnUrl?: string;
  thumbnailUrl?: string;
  alt?: string;
  caption?: string;
  description?: string;
  tags?: string[];
  hash?: string;
  storage: string; // local, s3, cloudinary, etc.
  isExternal: boolean;
  externalUrl?: string;
  metadata?: Record<string, unknown>;
  uploadedById: string;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostMedia {
  id: string;
  postId: string;
  mediaId: string;
  relationType: MediaRelationType;
  order: number;
  caption?: string;
  createdAt: Date;
}

