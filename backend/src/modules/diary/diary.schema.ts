import { z } from 'zod';

export const createDiaryEntrySchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
  watchedAt: z.coerce.date(),
  rewatch: z.boolean().default(false),
  rating: z.number().min(0.5).max(5).optional(),
  reviewContent: z.string().max(5000).optional(),
  containsSpoilers: z.boolean().default(false),
});

export const updateDiaryEntrySchema = z.object({
  watchedAt: z.coerce.date().optional(),
  rewatch: z.boolean().optional(),
  rating: z.number().min(0.5).max(5).optional(),
});

export const diaryIdParamSchema = z.object({ id: z.string().min(1) });
export const usernameParamSchema = z.object({ username: z.string().min(3).max(24) });
