import { prisma } from '../../config/prisma.js';
import { ensureMovieCached } from '../movies/movies.service.js';
import { logActivity } from '../activity/activity.service.js';

export const addToWatchlist = async (userId: string, tmdbId: number) => {
  const movie = await ensureMovieCached(tmdbId);
  const item = await prisma.watchlistItem.upsert({
    where: { userId_movieId: { userId, movieId: movie.id } },
    create: { userId, movieId: movie.id },
    update: {},
  });
  await logActivity({ type: 'WATCHLIST_ADD', userId, movieId: movie.id, refId: item.id });
  return item;
};

export const removeFromWatchlist = async (userId: string, tmdbId: number) => {
  const movie = await prisma.movie.findUnique({ where: { tmdbId } });
  if (!movie) return { deleted: false };
  await prisma.watchlistItem.deleteMany({ where: { userId, movieId: movie.id } });
  return { deleted: true };
};

export const listMyWatchlist = (userId: string) =>
  prisma.watchlistItem.findMany({
    where: { userId },
    include: { movie: true },
    orderBy: { addedAt: 'desc' },
  });

export const listWatchlistByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  if (!user) return null;

  return prisma.watchlistItem.findMany({
    where: { userId: user.id },
    include: { movie: true },
    orderBy: { addedAt: 'desc' },
  });
};