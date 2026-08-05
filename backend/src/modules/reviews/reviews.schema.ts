import { z } from 'zod';

export const createReviewSchema = z.object({
  content: z.string().min(1, 'Escreva sua resenha').max(5000),
  rating: z.number().min(0.5).max(5).optional(),
  containsSpoilers: z.boolean().default(false),
});

export const updateReviewSchema = createReviewSchema.partial();

export const tmdbIdParamSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
});

export const reviewIdParamSchema = z.object({
  id: z.string().min(1),
});
