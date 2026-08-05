import { prisma } from '../../config/prisma.js';
import { ensureMovieCached } from '../movies/movies.service.js';
import { logActivity } from '../activity/activity.service.js';

export const rateMovie = async (userId: string, tmdbId: number, score: number) => {
  const movie = await ensureMovieCached(tmdbId);

  const rating = await prisma.rating.upsert({
    where: { userId_movieId: { userId, movieId: movie.id } },
    create: { userId, movieId: movie.id, score },
    update: { score },
  });

  await logActivity({ type: 'RATING', userId, movieId: movie.id, refId: rating.id, metadata: { score } });
  return rating;
};

export const removeRating = async (userId: string, tmdbId: number) => {
  const movie = await prisma.movie.findUnique({ where: { tmdbId } });
  if (!movie) return { deleted: false };

  await prisma.rating.deleteMany({ where: { userId, movieId: movie.id } });
  return { deleted: true };
};

export const getMyRating = async (userId: string, tmdbId: number) => {
  const movie = await prisma.movie.findUnique({ where: { tmdbId } });
  if (!movie) return null;
  return prisma.rating.findUnique({ where: { userId_movieId: { userId, movieId: movie.id } } });
};
