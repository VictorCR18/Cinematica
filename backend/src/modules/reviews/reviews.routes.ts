import { Router } from 'express';
import { optionalAuth, requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './reviews.controller.js';
import { createReviewSchema, reviewIdParamSchema, tmdbIdParamSchema, updateReviewSchema } from './reviews.schema.js';

/** Rotas aninhadas em /api/movies/:tmdbId/reviews */
export const movieReviewsRouter = Router({ mergeParams: true });
movieReviewsRouter.post('/:tmdbId/reviews', requireAuth, validate({ params: tmdbIdParamSchema, body: createReviewSchema }), controller.create);
movieReviewsRouter.get('/:tmdbId/reviews', optionalAuth, validate({ params: tmdbIdParamSchema }), controller.listForMovie);

/** Rotas independentes em /api/reviews */
export const reviewsRouter = Router();
reviewsRouter.get('/:id', validate({ params: reviewIdParamSchema }), controller.getOne);
reviewsRouter.patch('/:id', requireAuth, validate({ params: reviewIdParamSchema, body: updateReviewSchema }), controller.update);
reviewsRouter.delete('/:id', requireAuth, validate({ params: reviewIdParamSchema }), controller.remove);
reviewsRouter.post('/:id/like', requireAuth, validate({ params: reviewIdParamSchema }), controller.like);
reviewsRouter.delete('/:id/like', requireAuth, validate({ params: reviewIdParamSchema }), controller.unlike);
