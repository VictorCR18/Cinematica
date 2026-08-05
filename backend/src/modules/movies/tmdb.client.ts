import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

const buildUrl = (path: string, params: Record<string, string | number | undefined> = {}) => {
  const url = new URL(`${env.TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', env.TMDB_API_KEY);
  url.searchParams.set('language', 'pt-BR');
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
};

/** Faz uma requisição GET à API do TMDB e retorna o JSON tipado. */
export const tmdbGet = async <T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> => {
  const response = await fetch(buildUrl(path, params));

  if (!response.ok) {
    if (response.status === 404) throw AppError.notFound('Filme não encontrado no TMDB');
    throw new AppError(`Falha ao consultar o TMDB (${response.status})`, 502);
  }

  return (await response.json()) as T;
};

export const tmdbImageUrl = (path: string | null | undefined, size: 'w200' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') =>
  path ? `${env.TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
