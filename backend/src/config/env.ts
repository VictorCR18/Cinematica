import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  DIRECT_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET deve ter ao menos 10 caracteres'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_NAME: z.string().default('cinematica_token'),
  TMDB_API_KEY: z.string().min(1, 'TMDB_API_KEY é obrigatória'),
  TMDB_BASE_URL: z.string().default('https://api.themoviedb.org/3'),
  TMDB_IMAGE_BASE_URL: z.string().default('https://image.tmdb.org/t/p'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Configuração de ambiente inválida. Verifique o arquivo .env');
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';
