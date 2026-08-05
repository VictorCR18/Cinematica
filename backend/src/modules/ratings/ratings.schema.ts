import { z } from 'zod';

export const rateSchema = z.object({
  score: z
    .number()
    .min(0.5, 'A nota mínima é 0.5')
    .max(5, 'A nota máxima é 5')
    .refine((v) => Math.round(v * 2) === v * 2, 'A nota deve variar em passos de 0.5'),
});

export const tmdbIdParamSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
});
