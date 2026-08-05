const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p';

export type TmdbImageSize = 'w200' | 'w342' | 'w500' | 'w780' | 'original';

export const tmdbImage = (path: string | null | undefined, size: TmdbImageSize = 'w500'): string | null =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;
