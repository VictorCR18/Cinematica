import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ensureMovieCached } from '../movies/movies.service.js';
import { logActivity } from '../activity/activity.service.js';

const tmdbIdParamSchema = z.object({ tmdbId: z.coerce.number().int().positive() });

const addToWatchlist = async (userId: string, tmdbId: number) => {
  const movie = await ensureMovieCached(tmdbId);
  const item = await prisma.watchlistItem.upsert({
    where: { userId_movieId: { userId, movieId: movie.id } },
    create: { userId, movieId: movie.id },
    update: {},
  });
  await logActivity({ type: 'WATCHLIST_ADD', userId, movieId: movie.id, refId: item.id });
  return item;
};

const removeFromWatchlist = async (userId: string, tmdbId: number) => {
  const movie = await prisma.movie.findUnique({ where: { tmdbId } });
  if (!movie) return { deleted: false };
  await prisma.watchlistItem.deleteMany({ where: { userId, movieId: movie.id } });
  return { deleted: true };
};

const listMyWatchlist = (userId: string) =>
  prisma.watchlistItem.findMany({ where: { userId }, include: { movie: true }, orderBy: { addedAt: 'desc' } });

export const watchlistRouter = Router();

watchlistRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await listMyWatchlist(req.user!.id));
  }),
);

watchlistRouter.post(
  '/:tmdbId',
  requireAuth,
  validate({ params: tmdbIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { tmdbId } = req.params as unknown as { tmdbId: number };
    res.status(201).json(await addToWatchlist(req.user!.id, tmdbId));
  }),
);

watchlistRouter.delete(
  '/:tmdbId',
  requireAuth,
  validate({ params: tmdbIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { tmdbId } = req.params as unknown as { tmdbId: number };
    res.json(await removeFromWatchlist(req.user!.id, tmdbId));
  }),
);
