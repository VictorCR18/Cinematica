import { z } from 'zod';

export const usernameParamSchema = z.object({
  username: z.string().min(3).max(24),
});

export const updateMeSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  bio: z.string().max(280).optional(),
  avatarUrl: z.url().optional().or(z.literal('')),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe sua senha atual'),
    newPassword: z.string().min(8, 'A nova senha deve ter ao menos 8 caracteres').max(72),
    confirmNewPassword: z.string().min(8).max(72),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'A confirmação da nova senha não confere',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'A nova senha deve ser diferente da senha atual',
    path: ['newPassword'],
  });

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
});
