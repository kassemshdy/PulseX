import { z } from 'zod';

export const PaginationDtoSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type PaginationDto = z.infer<typeof PaginationDtoSchema>;

export const SearchDtoSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: z.record(z.unknown()).optional(),
  facets: z.array(z.string()).optional(),
}).merge(PaginationDtoSchema);

export type SearchDto = z.infer<typeof SearchDtoSchema>;

export const IdParamDtoSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export type IdParamDto = z.infer<typeof IdParamDtoSchema>;

export const SlugParamDtoSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export type SlugParamDto = z.infer<typeof SlugParamDtoSchema>;

