import { z } from 'zod';

const usernameSchema = z
  .string()
  .min(3, 'O nome de usuário deve ter ao menos 3 caracteres')
  .max(24, 'O nome de usuário deve ter no máximo 24 caracteres')
  .regex(/^[a-z0-9_]+$/, 'Use apenas letras minúsculas, números e underscore');

export const registerSchema = z.object({
  name: z.string().min(2, 'Informe seu nome').max(80),
  username: usernameSchema,
  email: z.email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres').max(72),
});

export const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Informe sua senha'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
