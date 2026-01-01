import { z } from 'zod';
import { PageStatus } from '../types/page.types';

const PageSectionSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string().uuid(),
  type: z.string().min(1, 'Section type is required'),
  widgetId: z.string().uuid().optional(),
  dataSource: z.object({
    type: z.enum(['static', 'dynamic', 'query']),
    postTypeId: z.string().uuid().optional(),
    query: z.object({
      limit: z.number().optional(),
      offset: z.number().optional(),
      orderBy: z.array(z.object({
        field: z.string(),
        direction: z.enum(['asc', 'desc']),
      })).optional(),
      filters: z.record(z.unknown()).optional(),
      include: z.array(z.string()).optional(),
    }).optional(),
    staticData: z.unknown().optional(),
  }).optional(),
  settings: z.record(z.unknown()),
  children: z.array(PageSectionSchema).optional(),
}));

export const CreatePageDtoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  status: z.nativeEnum(PageStatus).default(PageStatus.DRAFT),
  layout: z.object({
    sections: z.array(PageSectionSchema),
    settings: z.record(z.unknown()).optional(),
  }),
  theme: z.record(z.unknown()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  templateId: z.string().uuid().optional(),
});

export type CreatePageDto = z.infer<typeof CreatePageDtoSchema>;

export const UpdatePageDtoSchema = CreatePageDtoSchema.partial();

export type UpdatePageDto = z.infer<typeof UpdatePageDtoSchema>;

