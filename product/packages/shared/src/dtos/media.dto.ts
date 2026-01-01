import { z } from 'zod';
import { MediaType } from '../types/media.types';

export const UploadMediaDtoSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().positive('Size must be positive'),
  type: z.nativeEnum(MediaType),
  alt: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type UploadMediaDto = z.infer<typeof UploadMediaDtoSchema>;

export const UpdateMediaDtoSchema = z.object({
  alt: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateMediaDto = z.infer<typeof UpdateMediaDtoSchema>;

export const InitiateResumableUploadDtoSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().positive('Size must be positive'),
  type: z.nativeEnum(MediaType),
  chunkSize: z.number().positive().default(5242880), // 5MB default
});

export type InitiateResumableUploadDto = z.infer<typeof InitiateResumableUploadDtoSchema>;

export const CompleteChunkUploadDtoSchema = z.object({
  uploadId: z.string().uuid('Invalid upload ID'),
  chunkIndex: z.number().min(0, 'Chunk index must be non-negative'),
  checksum: z.string().min(1, 'Checksum is required'),
});

export type CompleteChunkUploadDto = z.infer<typeof CompleteChunkUploadDtoSchema>;

