import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(500).default(1),
});

export const searchQuerySchema = z.object({
  query: z.string().min(1, 'Informe um termo de busca'),
  page: z.coerce.number().int().min(1).max(500).default(1),
});

export const tmdbIdParamSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
});
