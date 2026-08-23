import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { ensureMovieCached } from "../movies/movies.service.js";
import { logActivity } from "../activity/activity.service.js";
import {
  buildMeta,
  parsePagination,
  type PaginationQuery,
} from "../../utils/pagination.js";

const authorSelect = {
  id: true,
  name: true,
  username: true,
  avatarUrl: true,
} as const;

interface CreateReviewInput {
  content: string;
  rating?: number;
  containsSpoilers: boolean;
}

export const createReview = async (
  userId: string,
  tmdbId: number,
  input: CreateReviewInput,
) => {
  const movie = await ensureMovieCached(tmdbId);

  const review = await prisma.review.create({
    data: { userId, movieId: movie.id, ...input },
    include: { user: { select: authorSelect } },
  });

  await logActivity({
    type: "REVIEW",
    userId,
    movieId: movie.id,
    refId: review.id,
  });
  return review;
};

export const listReviewsForMovie = async (
  tmdbId: number,
  query: PaginationQuery,
  viewerId?: string,
) => {
  const movie = await prisma.movie.findUnique({ where: { tmdbId } });
  if (!movie) return { data: [], meta: buildMeta(1, 20, 0) };

  const { page, limit, skip, take } = parsePagination(query);
  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where: { movieId: movie.id },
      include: { user: { select: authorSelect } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.review.count({ where: { movieId: movie.id } }),
  ]);

  const likedIds = viewerId
    ? new Set(
        (
          await prisma.reviewLike.findMany({
            where: {
              userId: viewerId,
              reviewId: { in: data.map((r) => r.id) },
            },
            select: { reviewId: true },
          })
        ).map((l) => l.reviewId),
      )
    : new Set<string>();

  return {
    data: data.map((r) => ({ ...r, isLikedByViewer: likedIds.has(r.id) })),
    meta: buildMeta(page, limit, total),
  };
};

export const getReviewById = async (id: string, viewerId?: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: { user: { select: authorSelect }, movie: true },
  });
  if (!review) throw AppError.notFound("Resenha não encontrada");

  const isLikedByViewer = viewerId
    ? Boolean(
        await prisma.reviewLike.findUnique({
          where: { userId_reviewId: { userId: viewerId, reviewId: id } },
        }),
      )
    : false;

  return { ...review, isLikedByViewer };
};

export const updateReview = async (
  userId: string,
  id: string,
  input: Partial<CreateReviewInput>,
) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw AppError.notFound("Resenha não encontrada");
  if (review.userId !== userId)
    throw AppError.forbidden("Você só pode editar suas próprias resenhas");

  return prisma.review.update({
    where: { id },
    data: input,
    include: { user: { select: authorSelect } },
  });
};

export const deleteReview = async (userId: string, id: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw AppError.notFound("Resenha não encontrada");
  if (review.userId !== userId)
    throw AppError.forbidden("Você só pode remover suas próprias resenhas");

  await prisma.review.delete({ where: { id } });
  return { deleted: true };
};

export const likeReview = async (userId: string, reviewId: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw AppError.notFound("Resenha não encontrada");

  const alreadyLiked = await prisma.reviewLike.findUnique({
    where: { userId_reviewId: { userId, reviewId } },
  });
  if (alreadyLiked) return { liked: true };

  await prisma.$transaction([
    prisma.reviewLike.create({ data: { userId, reviewId } }),
    prisma.review.update({
      where: { id: reviewId },
      data: { likesCount: { increment: 1 } },
    }),
  ]);

  return { liked: true };
};

export const unlikeReview = async (userId: string, reviewId: string) => {
  const existing = await prisma.reviewLike.findUnique({
    where: { userId_reviewId: { userId, reviewId } },
  });
  if (!existing) return { liked: false };

  await prisma.$transaction([
    prisma.reviewLike.delete({
      where: { userId_reviewId: { userId, reviewId } },
    }),
    prisma.review.update({
      where: { id: reviewId },
      data: { likesCount: { decrement: 1 } },
    }),
  ]);

  return { liked: false };
};
