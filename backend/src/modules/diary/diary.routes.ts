import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as diaryService from './diary.service.js';
import { createDiaryEntrySchema, diaryIdParamSchema, updateDiaryEntrySchema, usernameParamSchema } from './diary.schema.js';

export const diaryRouter = Router();

diaryRouter.post(
  '/',
  requireAuth,
  validate({ body: createDiaryEntrySchema }),
  asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(await diaryService.logMovie(req.user!.id, req.body));
  }),
);

diaryRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await diaryService.listMyDiary(req.user!.id, req.query as { page?: string; limit?: string }));
  }),
);

diaryRouter.get(
  '/user/:username',
  validate({ params: usernameParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await diaryService.listDiaryByUsername(req.params.username as string, req.query as { page?: string; limit?: string }));
  }),
);

diaryRouter.patch(
  '/:id',
  requireAuth,
  validate({ params: diaryIdParamSchema, body: updateDiaryEntrySchema }),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await diaryService.updateEntry(req.user!.id, req.params.id as string, req.body));
  }),
);

diaryRouter.delete(
  '/:id',
  requireAuth,
  validate({ params: diaryIdParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await diaryService.deleteEntry(req.user!.id, req.params.id as string));
  }),
);
