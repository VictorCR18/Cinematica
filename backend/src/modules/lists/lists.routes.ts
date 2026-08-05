import { Router } from 'express';
import type { Request, Response } from 'express';
import { optionalAuth, requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as listsService from './lists.service.js';
import {
  addListItemSchema,
  createListSchema,
  listIdParamSchema,
  listItemParamSchema,
  updateListSchema,
} from './lists.schema.js';
import { usernameParamSchema } from '../users/users.schema.js';

export const listsRouter = Router();

listsRouter.post(
  '/',
  requireAuth,
  validate({ body: createListSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(await listsService.createList(req.user!.id, req.body));
  }),
);

listsRouter.get(
  '/user/:username',
  optionalAuth,
  validate({ params: usernameParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await listsService.listListsByUsername(req.params.username as string, req.user?.id));
  }),
);

listsRouter.get(
  '/:id',
  optionalAuth,
  validate({ params: listIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await listsService.getListById(req.params.id as string, req.user?.id));
  }),
);

listsRouter.patch(
  '/:id',
  requireAuth,
  validate({ params: listIdParamSchema, body: updateListSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await listsService.updateList(req.user!.id, req.params.id as string, req.body));
  }),
);

listsRouter.delete(
  '/:id',
  requireAuth,
  validate({ params: listIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await listsService.deleteList(req.user!.id, req.params.id as string));
  }),
);

listsRouter.post(
  '/:id/items',
  requireAuth,
  validate({ params: listIdParamSchema, body: addListItemSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { tmdbId, note } = req.body as { tmdbId: number; note?: string };
    res.status(201).json(await listsService.addItem(req.user!.id, req.params.id as string, tmdbId, note));
  }),
);

listsRouter.delete(
  '/:id/items/:tmdbId',
  requireAuth,
  validate({ params: listItemParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const { id, tmdbId } = req.params as unknown as { id: string; tmdbId: number };
    res.json(await listsService.removeItem(req.user!.id, id, tmdbId));
  }),
);
