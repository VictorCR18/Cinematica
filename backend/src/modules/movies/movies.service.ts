import { prisma } from '../../config/prisma.js';
import { tmdbGet } from './tmdb.client.js';
import type { TmdbMovieDetails, TmdbMovieSummary, TmdbGenre, TmdbPaginatedResponse } from './tmdb.types.js';

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

export const getPopular = (page: number) =>
  tmdbGet<TmdbPaginatedResponse<TmdbMovieSummary>>('/movie/popular', { page });

export const getNowPlaying = (page: number) =>
  tmdbGet<TmdbPaginatedResponse<TmdbMovieSummary>>('/movie/now_playing', { page });

export const getTopRated = (page: number) =>
  tmdbGet<TmdbPaginatedResponse<TmdbMovieSummary>>('/movie/top_rated', { page });

export const getUpcoming = (page: number) =>
  tmdbGet<TmdbPaginatedResponse<TmdbMovieSummary>>('/movie/upcoming', { page });

export const searchMovies = (query: string, page: number) =>
  tmdbGet<TmdbPaginatedResponse<TmdbMovieSummary>>('/search/movie', { query, page });

export const getGenres = () => tmdbGet<{ genres: TmdbGenre[] }>('/genre/movie/list');

/**
 * Garante que exista uma linha em `Movie` para o tmdbId informado, criando ou
 * atualizando o cache quando estiver ausente/expirado. Usado por qualquer
 * módulo que precise referenciar um filme (rating, review, diário, listas...).
 */
export const ensureMovieCached = async (tmdbId: number) => {
  const existing = await prisma.movie.findUnique({ where: { tmdbId } });
  const isStale = existing ? Date.now() - existing.cachedAt.getTime() > CACHE_TTL_MS : true;

  if (existing && !isStale) return existing;

  const details = await tmdbGet<TmdbMovieDetails>(`/movie/${tmdbId}`);

  return prisma.movie.upsert({
    where: { tmdbId },
    create: {
      tmdbId: details.id,
      title: details.title,
      originalTitle: details.original_title,
      overview: details.overview,
      posterPath: details.poster_path,
      backdropPath: details.backdrop_path,
      releaseDate: details.release_date ? new Date(details.release_date) : null,
      runtime: details.runtime,
      voteAverage: details.vote_average,
      genres: details.genres as unknown as object,
    },
    update: {
      title: details.title,
      overview: details.overview,
      posterPath: details.poster_path,
      backdropPath: details.backdrop_path,
      voteAverage: details.vote_average,
      genres: details.genres as unknown as object,
      cachedAt: new Date(),
    },
  });
};

/** Detalhes completos (TMDB ao vivo: elenco, vídeos, similares) + estatísticas locais do app. */
export const getMovieDetails = async (tmdbId: number) => {
  const [details, cached, stats] = await Promise.all([
    tmdbGet<TmdbMovieDetails>(`/movie/${tmdbId}`, { append_to_response: 'credits,videos,similar' }),
    ensureMovieCached(tmdbId),
    getMovieStats(tmdbId),
  ]);

  return { ...details, appId: cached.id, stats };
};

/** Média de nota e contagem de resenhas/avaliações registradas no próprio app. */
export const getMovieStats = async (tmdbId: number) => {
  const movie = await prisma.movie.findUnique({ where: { tmdbId } });
  if (!movie) return { averageRating: null, ratingsCount: 0, reviewsCount: 0, watchlistCount: 0 };

  const [ratingAgg, reviewsCount, watchlistCount] = await Promise.all([
    prisma.rating.aggregate({ where: { movieId: movie.id }, _avg: { score: true }, _count: true }),
    prisma.review.count({ where: { movieId: movie.id } }),
    prisma.watchlistItem.count({ where: { movieId: movie.id } }),
  ]);

  return {
    averageRating: ratingAgg._avg.score,
    ratingsCount: ratingAgg._count,
    reviewsCount,
    watchlistCount,
  };
};
