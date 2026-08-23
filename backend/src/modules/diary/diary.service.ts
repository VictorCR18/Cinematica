import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { ensureMovieCached } from "../movies/movies.service.js";
import { logActivity } from "../activity/activity.service.js";
import {
  buildMeta,
  parsePagination,
  type PaginationQuery,
} from "../../utils/pagination.js";

const include = {
  movie: true,
  review: true,
} as const;

interface CreateDiaryInput {
  tmdbId: number;
  watchedAt: Date;
  rewatch: boolean;
  rating?: number;
  reviewContent?: string;
  containsSpoilers: boolean;
}

/** Registra o "log" de um filme assistido — o coração do diário estilo Letterboxd. */
export const logMovie = async (userId: string, input: CreateDiaryInput) => {
  const movie = await ensureMovieCached(input.tmdbId);

  const entry = await prisma.$transaction(
    async (tx) => {
      let reviewId: string | undefined;

      if (input.reviewContent) {
        const review = await tx.review.create({
          data: {
            userId,
            movieId: movie.id,
            content: input.reviewContent,
            rating: input.rating,
            containsSpoilers: input.containsSpoilers,
          },
        });
        reviewId = review.id;
      }

      if (input.rating !== undefined) {
        await tx.rating.upsert({
          where: { userId_movieId: { userId, movieId: movie.id } },
          create: { userId, movieId: movie.id, score: input.rating },
          update: { score: input.rating },
        });
      }

      return tx.diaryEntry.create({
        data: {
          userId,
          movieId: movie.id,
          watchedAt: input.watchedAt,
          rewatch: input.rewatch,
          rating: input.rating,
          reviewId,
        },
        include,
      });
    },
    { timeout: 10000 },
  ); // margem extra, mas não é mais a correção principal

  // fora da transação: se falhar, não derruba o log do diário
  await logActivity({
    type: "DIARY",
    userId,
    movieId: movie.id,
    refId: entry.id,
  }).catch((err) => {
    console.error("Falha ao registrar atividade:", err);
  });

  return entry;
};

export const listMyDiary = async (userId: string, query: PaginationQuery) => {
  const { page, limit, skip, take } = parsePagination(query);
  const [data, total] = await Promise.all([
    prisma.diaryEntry.findMany({
      where: { userId },
      include,
      orderBy: { watchedAt: "desc" },
      skip,
      take,
    }),
    prisma.diaryEntry.count({ where: { userId } }),
  ]);
  return { data, meta: buildMeta(page, limit, total) };
};

export const listDiaryByUsername = async (
  username: string,
  query: PaginationQuery,
) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw AppError.notFound("Usuário não encontrado");
  return listMyDiary(user.id, query);
};

export const updateEntry = async (
  userId: string,
  id: string,
  data: { watchedAt?: Date; rewatch?: boolean; rating?: number },
) => {
  const entry = await prisma.diaryEntry.findUnique({ where: { id } });
  if (!entry) throw AppError.notFound("Entrada de diário não encontrada");
  if (entry.userId !== userId)
    throw AppError.forbidden("Você só pode editar seu próprio diário");

  return prisma.diaryEntry.update({ where: { id }, data, include });
};

export const deleteEntry = async (userId: string, id: string) => {
  const entry = await prisma.diaryEntry.findUnique({ where: { id } });
  if (!entry) throw AppError.notFound("Entrada de diário não encontrada");
  if (entry.userId !== userId)
    throw AppError.forbidden("Você só pode remover seu próprio diário");

  await prisma.diaryEntry.delete({ where: { id } });
  return { deleted: true };
};
