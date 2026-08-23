import { z } from 'zod';

export const tmdbIdParamSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
});

export const usernameParamSchema = z.object({
  username: z.string().min(1),
});