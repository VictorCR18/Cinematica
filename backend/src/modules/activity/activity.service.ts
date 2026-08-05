import type { ActivityType, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma.js';

interface LogActivityInput {
  type: ActivityType;
  userId: string;
  movieId?: string;
  refId?: string;
  metadata?: Prisma.InputJsonValue;
}

/** Registra um evento de atividade (rating, review, diário, watchlist, lista, follow). */
export const logActivity = (input: LogActivityInput) =>
  prisma.activity.create({
    data: {
      type: input.type,
      userId: input.userId,
      movieId: input.movieId,
      refId: input.refId,
      metadata: input.metadata,
    },
  });
