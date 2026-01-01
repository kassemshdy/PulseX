import { z } from 'zod';
import { PostStatus, RelationType } from '../types/post.types';

export const CreatePostTypeDtoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  icon: z.string().optional(),
  fields: z.array(z.object({
    key: z.string().min(1, 'Field key is required'),
    label: z.string().min(1, 'Field label is required'),
    type: z.string().min(1, 'Field type is required'),
    required: z.boolean().default(false),
    defaultValue: z.unknown().optional(),
    validation: z.record(z.unknown()).optional(),
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
  })).default([]),
  supportedMedia: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export type CreatePostTypeDto = z.infer<typeof CreatePostTypeDtoSchema>;

export const UpdatePostTypeDtoSchema = CreatePostTypeDtoSchema.partial();

export type UpdatePostTypeDto = z.infer<typeof UpdatePostTypeDtoSchema>;

export const CreatePostDtoSchema = z.object({
  postTypeId: z.string().uuid('Invalid post type ID'),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  scheduledFor: z.string().datetime().optional(),
  meta: z.record(z.string()).optional(),
  termIds: z.array(z.string().uuid()).optional(),
  mediaIds: z.array(z.string().uuid()).optional(),
  relations: z.array(z.object({
    targetPostId: z.string().uuid(),
    relationType: z.string(),
    order: z.number().optional(),
    metadata: z.record(z.unknown()).optional(),
  })).optional(),
});

export type CreatePostDto = z.infer<typeof CreatePostDtoSchema>;

export const UpdatePostDtoSchema = CreatePostDtoSchema.partial().omit({ postTypeId: true });

export type UpdatePostDto = z.infer<typeof UpdatePostDtoSchema>;

export const BulkUpdatePostsDtoSchema = z.object({
  postIds: z.array(z.string().uuid()).min(1, 'At least one post ID is required'),
  updates: z.object({
    status: z.nativeEnum(PostStatus).optional(),
    termIds: z.array(z.string().uuid()).optional(),
  }),
});

export type BulkUpdatePostsDto = z.infer<typeof BulkUpdatePostsDtoSchema>;

export const CreatePostTypeRelationDtoSchema = z.object({
  sourcePostTypeId: z.string().uuid(),
  targetPostTypeId: z.string().uuid(),
  name: z.string().min(1, 'Relation name is required'),
  relationType: z.nativeEnum(RelationType),
  required: z.boolean().default(false),
  multiple: z.boolean().default(false),
});

export type CreatePostTypeRelationDto = z.infer<typeof CreatePostTypeRelationDtoSchema>;

