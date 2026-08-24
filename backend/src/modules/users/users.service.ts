import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { buildMeta, parsePagination, type PaginationQuery } from '../../utils/pagination.js';
import { logActivity } from '../activity/activity.service.js';

const SALT_ROUNDS = 12;

const profileSelect = {
  id: true,
  name: true,
  username: true,
  bio: true,
  avatarUrl: true,
  reviewsPublic: true,
  watchlistPublic: true,
  listsPublic: true,
  createdAt: true,
} as const;

const settingsSelect = {
  email: true,
  reviewsPublic: true,
  watchlistPublic: true,
  listsPublic: true,
} as const;

export const getProfileByUsername = async (username: string, viewerId?: string) => {
  const user = await prisma.user.findUnique({ where: { username }, select: profileSelect });
  if (!user) throw AppError.notFound('Usuário não encontrado');

  const [ratingsCount, reviewsCount, diaryCount, followersCount, followingCount, isFollowedByViewer] = await Promise.all([
    prisma.rating.count({ where: { userId: user.id } }),
    prisma.review.count({ where: { userId: user.id } }),
    prisma.diaryEntry.count({ where: { userId: user.id } }),
    prisma.follow.count({ where: { followingId: user.id } }),
    prisma.follow.count({ where: { followerId: user.id } }),
    viewerId
      ? prisma.follow.findUnique({ where: { followerId_followingId: { followerId: viewerId, followingId: user.id } } })
      : Promise.resolve(null),
  ]);

  return {
    ...user,
    stats: { ratingsCount, reviewsCount, diaryCount, followersCount, followingCount },
    isFollowedByViewer: Boolean(isFollowedByViewer),
    isViewer: viewerId === user.id,
  };
};

export const updateMe = (userId: string, data: { name?: string; bio?: string; avatarUrl?: string }) =>
  prisma.user.update({ where: { id: userId }, data, select: profileSelect });

export const getSettings = (userId: string) =>
  prisma.user.findUniqueOrThrow({ where: { id: userId }, select: settingsSelect });

export const updateSettings = (userId: string, data: { reviewsPublic?: boolean; watchlistPublic?: boolean; listsPublic?: boolean }) =>
  prisma.user.update({ where: { id: userId }, data, select: settingsSelect });

export const changeEmail = async (userId: string, input: { email: string; currentPassword: string }) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, passwordHash: true } });
  if (!user) throw AppError.notFound('Usuário não encontrado');
  if (user.email === input.email) return { email: user.email };

  const validPassword = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!validPassword) throw AppError.unauthorized('Senha atual incorreta');

  try {
    return await prisma.user.update({ where: { id: userId }, data: { email: input.email }, select: { email: true } });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') throw AppError.conflict('Este e-mail já está em uso');
    throw error;
  }
};

export const changePassword = async (
  userId: string,
  input: { currentPassword: string; newPassword: string; confirmNewPassword: string },
) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  if (!user) throw AppError.notFound('Usuário não encontrado');

  const validCurrentPassword = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!validCurrentPassword) throw AppError.unauthorized('Senha atual incorreta');

  const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
};

export const follow = async (followerId: string, targetUsername: string) => {
  const target = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!target) throw AppError.notFound('Usuário não encontrado');
  if (target.id === followerId) throw AppError.badRequest('Você não pode seguir a si mesmo');

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId, followingId: target.id } },
    create: { followerId, followingId: target.id },
    update: {},
  });

  await logActivity({ type: 'FOLLOW', userId: followerId, refId: target.id });
  return { following: true };
};

export const unfollow = async (followerId: string, targetUsername: string) => {
  const target = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!target) throw AppError.notFound('Usuário não encontrado');

  await prisma.follow.deleteMany({ where: { followerId, followingId: target.id } });
  return { following: false };
};

export const listFollowers = async (username: string, viewerId?: string) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw AppError.notFound('Usuário não encontrado');

  const follows = await prisma.follow.findMany({
    where: { followingId: user.id },
    include: { follower: { select: profileSelect } },
    orderBy: { createdAt: 'desc' },
  });

  const viewerFollowingIds = viewerId
    ? new Set(
        (
          await prisma.follow.findMany({
            where: {
              followerId: viewerId,
              followingId: { in: follows.map((follow) => follow.follower.id) },
            },
            select: { followingId: true },
          })
        ).map((follow) => follow.followingId),
      )
    : new Set<string>();

  return follows.map((follow) => ({
    ...follow.follower,
    isFollowedByViewer: viewerFollowingIds.has(follow.follower.id),
  }));
};

export const listFollowing = async (username: string, viewerId?: string) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw AppError.notFound('Usuário não encontrado');

  const follows = await prisma.follow.findMany({
    where: { followerId: user.id },
    include: { following: { select: profileSelect } },
    orderBy: { createdAt: 'desc' },
  });

  const viewerFollowingIds = viewerId
    ? new Set(
        (
          await prisma.follow.findMany({
            where: {
              followerId: viewerId,
              followingId: { in: follows.map((follow) => follow.following.id) },
            },
            select: { followingId: true },
          })
        ).map((follow) => follow.followingId),
      )
    : new Set<string>();

  return follows.map((follow) => ({
    ...follow.following,
    isFollowedByViewer: viewerFollowingIds.has(follow.following.id),
  }));
};

export const listRatingsByUsername = async (username: string, query: PaginationQuery) => {
  const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  if (!user) throw AppError.notFound('Usuário não encontrado');

  const { page, limit, skip, take } = parsePagination(query);

  const [data, total] = await Promise.all([
    prisma.rating.findMany({
      where: { userId: user.id },
      include: {
        movie: {
          select: {
            id: true,
            tmdbId: true,
            title: true,
            originalTitle: true,
            overview: true,
            posterPath: true,
            backdropPath: true,
            releaseDate: true,
            runtime: true,
            voteAverage: true,
            genres: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take,
    }),
    prisma.rating.count({ where: { userId: user.id } }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const listReviewsByUsername = async (username: string, query: PaginationQuery, viewerId?: string) => {
  const user = await prisma.user.findUnique({ where: { username }, select: { id: true, reviewsPublic: true } });
  if (!user) throw AppError.notFound('Usuário não encontrado');
  if (!user.reviewsPublic && user.id !== viewerId) return { data: [], meta: buildMeta(1, 20, 0) };

  const { page, limit, skip, take } = parsePagination(query);

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where: { userId: user.id },
      include: {
        user: { select: profileSelect },
        movie: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.review.count({ where: { userId: user.id } }),
  ]);

  const likedIds = viewerId
    ? new Set(
        (
          await prisma.reviewLike.findMany({
            where: {
              userId: viewerId,
              reviewId: { in: data.map((review) => review.id) },
            },
            select: { reviewId: true },
          })
        ).map((like) => like.reviewId),
      )
    : new Set<string>();

  return {
    data: data.map((review) => ({ ...review, isLikedByViewer: likedIds.has(review.id) })),
    meta: buildMeta(page, limit, total),
  };
};
