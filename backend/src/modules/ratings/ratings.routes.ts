import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as ratingsService from './ratings.service.js';
import { rateSchema, tmdbIdParamSchema } from './ratings.schema.js';

export const ratingsRouter = Router();

ratingsRouter.put(
  '/:tmdbId/rating',
  requireAuth,
  validate({ params: tmdbIdParamSchema, body: rateSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { tmdbId } = req.params as unknown as { tmdbId: number };
    const { score } = req.body as { score: number };
    res.json(await ratingsService.rateMovie(req.user!.id, tmdbId, score));
  }),
);

ratingsRouter.delete(
  '/:tmdbId/rating',
  requireAuth,
  validate({ params: tmdbIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { tmdbId } = req.params as unknown as { tmdbId: number };
    res.json(await ratingsService.removeRating(req.user!.id, tmdbId));
  }),
);

ratingsRouter.get(
  '/:tmdbId/rating/me',
  requireAuth,
  validate({ params: tmdbIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { tmdbId } = req.params as unknown as { tmdbId: number };
    res.json(await ratingsService.getMyRating(req.user!.id, tmdbId));
  }),
);
