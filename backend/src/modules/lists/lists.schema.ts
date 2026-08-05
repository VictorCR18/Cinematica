import { z } from 'zod';

export const createListSchema = z.object({
  name: z.string().min(1, 'Dê um nome para a lista').max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
});

export const updateListSchema = createListSchema.partial();

export const addListItemSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
  note: z.string().max(500).optional(),
});

export const listIdParamSchema = z.object({ id: z.string().min(1) });
export const listItemParamSchema = z.object({ id: z.string().min(1), tmdbId: z.coerce.number().int().positive() });
