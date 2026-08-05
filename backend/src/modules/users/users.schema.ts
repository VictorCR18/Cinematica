import { z } from 'zod';

export const usernameParamSchema = z.object({
  username: z.string().min(3).max(24),
});

export const updateMeSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  bio: z.string().max(280).optional(),
  avatarUrl: z.url().optional().or(z.literal('')),
});
