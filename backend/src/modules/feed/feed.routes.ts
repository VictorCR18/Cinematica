import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { buildMeta, parsePagination } from '../../utils/pagination.js';

const getFeedForUser = async (userId: string, query: { page?: string; limit?: string }) => {
  const { page, limit, skip, take } = parsePagination(query);

  const following = await prisma.follow.findMany({ where: { followerId: userId }, select: { followingId: true } });
  const authorIds = [userId, ...following.map((f) => f.followingId)];

  const [data, total] = await Promise.all([
    prisma.activity.findMany({
      where: { userId: { in: authorIds } },
      include: {
        user: { select: { id: true, name: true, username: true, avatarUrl: true } },
        movie: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.activity.count({ where: { userId: { in: authorIds } } }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const feedRouter = Router();

feedRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getFeedForUser(req.user!.id, req.query as { page?: string; limit?: string }));
  }),
);
